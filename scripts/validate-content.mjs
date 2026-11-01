#!/usr/bin/env node
// Checks every unit file for structural mistakes the app would trip over:
//   node scripts/validate-content.mjs
// Exits non-zero on errors; warnings (e.g. a word repeated across units) are printed only.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toPlain, toKana } from '../src/lib/furigana.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src/content')
const KANJI = /[㐀-鿿豈-﫿]/
const POS = new Set(['noun', 'verb', 'i-adj', 'na-adj', 'adverb', 'pronoun', 'expression', 'number', 'counter', 'suffix', 'particle', 'conjunction', 'prefix'])

const errors = []
const warnings = []
const ids = new Set()
const words = new Map() // plain word → unit id
const kanjiSeen = new Map()

// Kanji left outside a [..] annotation would show without furigana.
function checkMarkup(where, text) {
  if (typeof text !== 'string') return errors.push(`${where}: missing text`)
  const stripped = text.replace(/[㐀-鿿豈-﫿々〆ヶ]+\[[^\]]+\]/g, '')
  if (KANJI.test(stripped)) errors.push(`${where}: kanji without furigana in "${text}"`)
  for (const m of text.matchAll(/\[([^\]]*)\]/g)) {
    if (!/^[ぁ-ゟー]+$/.test(m[1])) errors.push(`${where}: furigana must be hiragana: [${m[1]}]`)
  }
}

function checkQuestions(where, questions = []) {
  if (!questions.length) errors.push(`${where}: no questions`)
  questions.forEach((q, i) => {
    if (!q.q || q.options?.length !== 4) errors.push(`${where} q${i + 1}: needs a question and 4 options`)
    if (!(q.answer >= 0 && q.answer < (q.options?.length ?? 0))) errors.push(`${where} q${i + 1}: answer index out of range`)
  })
  const answers = questions.map((q) => q.answer)
  if (answers.length > 2 && new Set(answers).size === 1) warnings.push(`${where}: every answer is option ${answers[0]}`)
}

function claim(id, where) {
  if (!id) return errors.push(`${where}: missing id`)
  if (ids.has(id)) errors.push(`${where}: duplicate id ${id}`)
  ids.add(id)
}

const levels = readdirSync(root).filter((d) => /^n\d$/.test(d))
let unitCount = 0
for (const level of levels.sort().reverse()) {
  for (const file of readdirSync(join(root, level)).filter((f) => /^unit-\d+\.json$/.test(f)).sort()) {
    unitCount++
    let unit
    try {
      unit = JSON.parse(readFileSync(join(root, level, file), 'utf8'))
    } catch (e) {
      errors.push(`${file}: invalid JSON — ${e.message}`)
      continue
    }
    const u = unit.id ?? file
    claim(unit.id, file)
    if (!unit.title || !unit.goal || !unit.number) errors.push(`${u}: needs title, goal, number`)

    for (const v of unit.vocab ?? []) {
      const w = `${u} ${v.id}`
      claim(v.id, w)
      checkMarkup(w, v.word)
      if (!v.meaning) errors.push(`${w}: no meaning`)
      if (!POS.has(v.pos)) errors.push(`${w}: unknown pos "${v.pos}"`)
      if (v.example) {
        checkMarkup(`${w} example`, v.example.jp)
        if (!v.example.en) errors.push(`${w}: example without English`)
      }
      // Same spelling AND reading = a true repeat (〜人 じん vs 〜人 にん are different words).
      const plain = `${toPlain(v.word)}（${toKana(v.word)}）`
      if (words.has(plain)) warnings.push(`${w}: "${plain}" already taught in ${words.get(plain)}`)
      else words.set(plain, u)
    }

    for (const k of unit.kanji ?? []) {
      const w = `${u} ${k.id}`
      claim(k.id, w)
      if ([...(k.char ?? '')].length !== 1) errors.push(`${w}: char must be one kanji`)
      if (kanjiSeen.has(k.char)) errors.push(`${w}: kanji ${k.char} already in ${kanjiSeen.get(k.char)}`)
      kanjiSeen.set(k.char, u)
      if (!k.meanings?.length || !Array.isArray(k.on) || !Array.isArray(k.kun) || !k.strokes) errors.push(`${w}: needs meanings, on, kun, strokes`)
      if (!k.words?.length) errors.push(`${w}: no example words`)
      for (const kw of k.words ?? []) checkMarkup(`${w} word`, kw.word)
    }

    for (const g of unit.grammar ?? []) {
      const w = `${u} ${g.id}`
      claim(g.id, w)
      if (!g.title || !g.pattern || !g.meaning || !g.explanation) errors.push(`${w}: needs title, pattern, meaning, explanation`)
      if ((g.examples ?? []).length < 2) errors.push(`${w}: needs 2+ examples`)
      for (const e of g.examples ?? []) checkMarkup(`${w} example`, e.jp)
      if ((g.drills ?? []).length < 3) errors.push(`${w}: needs 3+ drills`)
      ;(g.drills ?? []).forEach((d, i) => {
        const dw = `${w} drill ${i + 1}`
        if (d.type === 'choice') {
          checkMarkup(dw, d.jp)
          if ((d.jp.match(/＿/g) ?? []).length !== 1) errors.push(`${dw}: needs exactly one ＿`)
          if (d.options?.length !== 4 || new Set(d.options).size !== 4) errors.push(`${dw}: needs 4 distinct options`)
          if (!d.options?.includes(d.answer)) errors.push(`${dw}: answer not in options`)
        } else if (d.type === 'order') {
          d.tokens?.forEach((t) => checkMarkup(dw, t))
          if (!(d.tokens?.length >= 2 && d.tokens.length <= 6)) errors.push(`${dw}: needs 2–6 tokens`)
          if (new Set(d.tokens).size !== d.tokens?.length) errors.push(`${dw}: repeated token makes order ambiguous`)
        } else errors.push(`${dw}: unknown drill type ${d.type}`)
        if (!d.en) errors.push(`${dw}: no English`)
      })
    }

    if (unit.reading) {
      checkMarkup(`${u} reading`, unit.reading.text)
      checkQuestions(`${u} reading`, unit.reading.questions)
    } else warnings.push(`${u}: no reading`)
    if (unit.listening) {
      unit.listening.lines?.forEach((l, i) => checkMarkup(`${u} listening line ${i + 1}`, l.jp))
      checkQuestions(`${u} listening`, unit.listening.questions)
    } else warnings.push(`${u}: no listening`)

    console.log(
      `${u.padEnd(8)} ${String(unit.vocab?.length ?? 0).padStart(3)} words  ${String(unit.kanji?.length ?? 0).padStart(2)} kanji  ${String(unit.grammar?.length ?? 0).padStart(2)} grammar`
    )
  }
}

// Place cards: one per journey stop.
const placeDir = join(root, 'places')
let placeCount = 0
if (existsSync(placeDir)) {
  for (const file of readdirSync(placeDir).filter((f) => f.endsWith('.json'))) {
    placeCount++
    const p = JSON.parse(readFileSync(join(placeDir, file), 'utf8'))
    const w = `places/${file}`
    for (const f of ['unitId', 'place', 'jp', 'prefecture', 'region', 'tagline', 'history']) if (!p[f]) errors.push(`${w}: missing ${f}`)
    if (typeof p.lat !== 'number' || typeof p.lng !== 'number') errors.push(`${w}: needs numeric lat/lng`)
    checkMarkup(`${w} jp`, p.jp)
    if (!(p.sites?.length >= 2)) errors.push(`${w}: needs 2+ sites`)
    p.sites?.forEach((s) => checkMarkup(`${w} site ${s.name}`, s.jp))
    p.words?.forEach((x) => checkMarkup(`${w} word`, x.word))
    if (!p.stamp?.kanji) errors.push(`${w}: missing stamp.kanji`)
    if (p.reading) {
      checkMarkup(`${w} reading`, p.reading.text)
      checkQuestions(`${w} reading`, p.reading.questions)
    }
  }
}

console.log(`\n${unitCount} units · ${words.size} unique words · ${kanjiSeen.size} kanji · ${placeCount} places`)
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  ${warnings.join('\n  ')}`)
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n  ${errors.join('\n  ')}`)
  process.exit(1)
}
console.log('\nNo errors.')
