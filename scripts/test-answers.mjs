#!/usr/bin/env node
// Answer-key test: answers every question in the course with its own correct
// answer and fails if the app would mark it wrong, or if a question offers two
// options a learner can't tell apart.
//   npm test
// Loads the real app modules through Vite (so import.meta.glob works), with no
// browser and no extra dependencies.
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
const load = (path) => vite.ssrLoadModule(path)

const failures = []
const fail = (msg) => failures.length < 200 && failures.push(msg)

try {
  const C = await load('/src/lib/curriculum.js')
  const E = await load('/src/lib/exercises.js')
  const F = await load('/src/lib/furigana.js')
  const W = await load('wanakana')

  const items = C.allItems()
  let typed = 0
  let generated = 0

  for (const it of items) {
    // 1. Typed answers: find the item's real typing exercise and grade the ways a
    //    learner would type the right answer exactly as TypeExercise does.
    let typeEx = null
    for (let k = 0; k < 60 && !typeEx; k++) {
      const e = E.exerciseForItem(it.id)
      if (e?.type === 'type') typeEx = e
    }
    if (typeEx) {
      const grade = (input) => F.normaliseKana(typeEx.input === 'kana' ? W.toHiragana(input) : W.toHiragana(input.trim().toLowerCase()))
      const kana = it.type === 'kana' ? it.char : F.toKana(it.word).replace(/[〜~]/g, '')
      const ways = it.type === 'kana' ? [it.romaji, W.toRomaji(kana)] : [W.toRomaji(kana), W.toRomaji(kana.replace(/ー/g, '-'))]
      for (const input of new Set(ways)) {
        typed++
        if (!typeEx.accept.includes(grade(input))) fail(`${it.type} ${it.char ?? F.toPlain(it.word)}: typing "${input}" → ${grade(input)} is marked wrong (accepts ${typeEx.accept.join(' / ')})`)
      }
    }

    // 2. Generated exercises: sample each item many times (distractors are random).
    for (let k = 0; k < 20; k++) {
      const e = E.exerciseForItem(it.id)
      if (!e) continue
      generated++
      if (e.type === 'choice') {
        if (e.answer < 0) fail(`${it.id} ${e.kind}: correct answer missing from options`)
        if (new Set(e.options).size !== e.options.length) fail(`${it.id} ${e.kind}: duplicate options`)
        const others = e.options.filter((_, i) => i !== e.answer)
        // Sound-only questions must never offer a homophone of the answer.
        if (e.kind === 'kana-listen') {
          for (const o of others) {
            const other = items.find((x) => x.type === 'kana' && x.char === o)
            if (other && other.romaji === it.romaji) fail(`${it.char}: listening offers same-sound ${o}`)
          }
        }
        if (e.kind === 'vocab-listen') {
          for (const o of others) {
            const other = items.find((x) => x.type === 'vocab' && x.meaning === o && F.speechText(x.word) === F.speechText(it.word))
            if (other) fail(`${F.toPlain(it.word)}: listening offers homophone ${F.toPlain(other.word)}`)
          }
        }
      }
      if (e.type === 'type' && !e.accept.every(Boolean)) fail(`${it.id}: empty accepted answer`)
    }
  }

  // 3. Every lesson must produce exercises.
  for (const lesson of C.LESSONS) {
    const unit = C.getUnit(lesson.unitId)
    const exs =
      lesson.kind === 'checkpoint'
        ? E.checkpointExercises(lesson)
        : lesson.kind === 'reading'
          ? E.questionExercises(unit.reading.questions, 'reading')
          : lesson.kind === 'listening'
            ? E.questionExercises(unit.listening.questions, 'listening')
            : lesson.kind === 'travel'
              ? E.questionExercises(unit.place.reading.questions, 'travel')
              : E.lessonExercises(lesson)
    if (!exs.length) fail(`${lesson.id}: no exercises`)
    for (const e of exs) if (e.type === 'choice' && e.answer < 0) fail(`${lesson.id}: question without a correct option`)
  }

  // 4. Flashbacks: due items come back; the lesson's own items, later lessons'
  // items and today's reviews don't.
  const S = await load('/src/lib/sm2.js')
  const lesson = C.LESSONS.find((l) => l.kind === 'vocab' && l.unitId.endsWith('u03'))
  const old = items.filter((x) => x.type === 'vocab' && C.taughtBefore(x.id, lesson)).slice(0, 5)
  const later = items.find((x) => x.type === 'vocab' && !lesson.items.includes(x.id) && !C.taughtBefore(x.id, lesson))
  const yesterday = new Date(Date.now() - 864e5)
  const srs = {}
  for (const x of old) srs[x.id] = { item_id: x.id, ...S.reviewCard(null, false, yesterday) }
  srs[lesson.items[0]] = { item_id: lesson.items[0], ...S.reviewCard(null, false, yesterday) }
  srs[later.id] = { item_id: later.id, ...S.reviewCard(null, false, yesterday) }
  srs[old[4].id] = { item_id: old[4].id, ...S.reviewCard(null, false) } // reviewed today
  const fb = E.flashbackExercises(srs, lesson, 3)
  if (fb.length !== 3) fail(`flashbacks: expected 3, got ${fb.length}`)
  if (!fb.every((e) => e.flashback)) fail('flashbacks: missing flashback flag')
  if (fb.some((e) => lesson.items.includes(e.itemId) || e.itemId === later.id || e.itemId === old[4].id)) fail('flashbacks: picked a current-lesson, later-lesson or already-reviewed item')
  const mixed = E.sprinkle([1, 2, 3, 4, 5, 6], ['a', 'b'])
  if (mixed.length !== 8 || mixed[0] === 'a') fail(`sprinkle: bad placement ${mixed}`)

  // 5. "Read it!" questions: word spelled only with kana known by then, the
  //    right answer is its romaji, and every option carries a meaning.
  const R = await load('/src/lib/readable.js')
  let readQs = 0
  for (const lesson of C.LESSONS.filter((l) => l.kind === 'kana')) {
    const { known } = R.lessonPayoff(lesson.id)
    for (let k = 0; k < 10; k++) {
      for (const e of E.readWordExercises(lesson.id)) {
        readQs++
        const word = e.prompt.jp
        if ([...word.replace(/ー/g, '')].some((ch) => !known.has(ch))) fail(`${lesson.id}: read-it word ${word} uses unlearned kana`)
        if (e.answer < 0 || new Set(e.options).size !== 4) fail(`${lesson.id}: read-it ${word} has bad options`)
        if (e.options[e.answer] !== W.toRomaji(word)) fail(`${lesson.id}: read-it ${word} answer is ${e.options[e.answer]}`)
        if (e.notes?.length !== 4 || !e.notes.every(Boolean)) fail(`${lesson.id}: read-it ${word} options missing meanings`)
      }
    }
  }
  if (!readQs) fail('read-it: no questions generated')

  // 6. Every kana has a memory hint: a picture word that starts with it (or, for
  // を/ん/ぢ, contains it), and voiced/combo kana say how they're built.
  for (const it of items.filter((i) => i.type === 'kana')) {
    const h = it.hint
    if (!h) {
      fail(`${it.char}: no memory hint`)
      continue
    }
    if (h.word) {
      if (!h.emoji || !h.meaning) fail(`${it.char}: picture word missing emoji or meaning`)
      if (h.note ? !h.word.includes(it.char) : !h.word.startsWith(it.char)) fail(`${it.char}: picture word ${h.word} doesn't start with it`)
    }
    // Base kana also get a shape story that names their sound.
    if (it.group === 'base' && !h.shape?.includes(`{${it.romaji}}`)) fail(`${it.char}: shape story missing or doesn't name {${it.romaji}}`)
    const built = h.word ? h.built : h.text
    if (it.group !== 'base' && (!built || /undefined/.test(built) || !built.endsWith(`{${it.romaji}}.`))) fail(`${it.char}: built-from hint doesn't end on its sound`)
  }

  console.log(`${C.LESSONS.length} lessons · ${items.length} items · ${typed} typed answers · ${generated} generated exercises · ${readQs} read-it questions`)
} finally {
  await vite.close()
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} answer-key failure(s):\n  ${failures.join('\n  ')}`)
  process.exit(1)
}
console.log('✓ Every correct answer is accepted.')
