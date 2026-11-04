import { toHiragana, toRomaji } from 'wanakana'
import { getItem, knownPeers, taughtBefore } from './curriculum'
import { toKana, toPlain, normaliseKana, readingVariants, hasKanji, speechText } from './furigana'
import { isDue, toDateString } from './sm2'
import { lessonPayoff } from './readable'

// An exercise is a plain object the lesson player renders:
//   choice — prompt + 4 options, one correct (answer = option index)
//   type   — prompt + typed romaji/kana answer, checked against `accept`
//   order  — tap tokens into the right order
// `speak` is the Japanese (kana form) voiced once the answer is revealed.

export function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const sample = (list) => list[Math.floor(Math.random() * list.length)]

// Four options: the right one plus three distinct distractors from `pool`.
function choice({ item, prompt, correct, pool, labelOf, noteOf, speak, kind }) {
  const correctLabel = labelOf(correct)
  const seen = new Set([correctLabel])
  const picked = [correct]
  for (const candidate of shuffle(pool)) {
    const label = labelOf(candidate)
    if (!label || seen.has(label)) continue
    seen.add(label)
    picked.push(candidate)
    if (picked.length === 4) break
  }
  const order = shuffle(picked)
  const options = order.map(labelOf)
  // Optional small print under each option (e.g. a word's meaning).
  const notes = noteOf ? order.map(noteOf) : undefined
  return { kind, type: 'choice', itemId: item.id, prompt, options, notes, answer: options.indexOf(correctLabel), speak }
}

const meaningOf = (item) =>
  item.type === 'kanji' ? item.meanings.slice(0, 2).join(', ') : item.meaning

const speakOf = (item) => {
  if (item.type === 'kana') return item.char
  if (item.type === 'kanji') return item.words?.[0] ? speechText(item.words[0].word) : null
  return speechText(item.word)
}

// ---- per item type -------------------------------------------------------

function kanaExercises(item, pool) {
  return {
    read: () =>
      choice({
        kind: 'kana-read', item, pool, correct: item, speak: item.char,
        prompt: { label: 'Which sound is this?', jp: item.char, big: true, listen: item.char },
        labelOf: (k) => k.romaji,
      }),
    listen: () =>
      choice({
        kind: 'kana-listen', item, correct: item, speak: item.char,
        prompt: { label: 'Tap what you hear', audio: item.char },
        // ぢ/じ and づ/ず sound identical, so never offer a same-sound distractor.
        pool: pool.filter((k) => k.id === item.id || k.romaji !== item.romaji),
        labelOf: (k) => k.char,
      }),
    type: () => ({
      kind: 'kana-type', type: 'type', itemId: item.id, speak: item.char,
      prompt: { label: 'Type the sound in romaji', jp: item.char, big: true },
      input: 'romaji',
      // The listed romaji is always right: "ji" for ぢ (→ じ) as well as "di" (→ ぢ).
      accept: [normaliseKana(item.char), normaliseKana(toHiragana(item.romaji))],
      display: item.romaji,
    }),
  }
}

function canTypeWord(item) {
  const kana = normaliseKana(item.word)
  return item.pos !== 'expression' && !item.word.includes('〜') && kana.length >= 2 && kana.length <= 8
}

function vocabExercises(item, pool) {
  return {
    meaning: () =>
      choice({
        kind: 'vocab-meaning', item, pool, correct: item, speak: speakOf(item),
        prompt: { label: 'What does this mean?', jp: item.word, big: true },
        labelOf: meaningOf,
      }),
    word: () =>
      choice({
        kind: 'vocab-word', item, pool, correct: item, speak: speakOf(item),
        prompt: { label: 'Which word means…', en: item.meaning },
        labelOf: (v) => v.word,
      }),
    listen: () =>
      choice({
        kind: 'vocab-listen', item, correct: item, speak: speakOf(item),
        prompt: { label: 'What does this mean?', audio: speakOf(item) },
        // Homophones (三 / 〜さん, 番 / 晩) can't be told apart by ear — leave them out.
        pool: pool.filter((v) => v.id === item.id || speakOf(v) !== speakOf(item)),
        labelOf: meaningOf,
      }),
    type: canTypeWord(item)
      ? () => ({
          kind: 'vocab-type', type: 'type', itemId: item.id, speak: speakOf(item),
          prompt: hasKanji(item.word)
            ? { label: 'Type the reading', jp: toPlain(item.word), big: true, hint: item.meaning }
            : { label: 'Type the Japanese word', en: item.meaning, audio: speakOf(item) },
          input: 'kana',
          accept: readingVariants(item.word),
          display: toKana(item.word),
        })
      : null,
  }
}

function kanjiExercises(item, pool) {
  const word = item.words?.length ? sample(item.words) : null
  const wordPool = pool.flatMap((k) => k.words ?? [])
  return {
    meaning: () =>
      choice({
        kind: 'kanji-meaning', item, pool, correct: item, speak: speakOf(item),
        prompt: { label: 'What does this kanji mean?', jp: item.char, big: true, kanji: true },
        labelOf: meaningOf,
      }),
    reading: word
      ? () =>
          choice({
            kind: 'kanji-reading', item, pool: wordPool, correct: word, speak: speechText(word.word),
            prompt: { label: 'How do you read this?', jp: toPlain(word.word), big: true, hint: word.meaning },
            labelOf: (w) => toKana(w.word),
          })
      : null,
  }
}

function drillExercise(item, drill) {
  if (drill.type === 'order') {
    return {
      kind: 'grammar-order', type: 'order', itemId: item.id,
      prompt: { label: 'Put the words in order', en: drill.en },
      tokens: drill.tokens,
      speak: speechText(drill.tokens.join('')),
    }
  }
  const options = shuffle(drill.options)
  return {
    kind: 'grammar-choice', type: 'choice', itemId: item.id,
    prompt: { label: 'Fill in the blank', jp: drill.jp, en: drill.en, cloze: true },
    options,
    answer: options.indexOf(drill.answer),
    speak: speechText(drill.jp.replace('＿', drill.answer)),
  }
}

function makersFor(item) {
  const pool = knownPeers(item)
  switch (item.type) {
    case 'kana':
      return kanaExercises(item, pool)
    case 'vocab':
      return vocabExercises(item, pool)
    case 'kanji':
      return kanjiExercises(item, pool)
    default:
      return {}
  }
}

const run = (maker) => (maker ? maker() : null)

// ---- sessions -------------------------------------------------------------

// Exercises for a fresh lesson: every item twice, the easier recognition
// exercise first, recall second, then shuffled so it's not predictable.
export function lessonExercises(lesson) {
  const items = lesson.items.map(getItem)
  if (lesson.kind === 'grammar') {
    const item = items[0]
    return item.drills.map((d) => drillExercise(item, d))
  }
  const first = []
  const second = []
  for (const item of items) {
    const m = makersFor(item)
    if (item.type === 'kana') {
      first.push(run(m.read))
      second.push(run(Math.random() < 0.5 ? m.listen : m.type))
    } else if (item.type === 'vocab') {
      first.push(run(sample([m.meaning, m.listen])))
      second.push(run(m.type && Math.random() < 0.5 ? m.type : m.word))
    } else if (item.type === 'kanji') {
      first.push(run(m.meaning))
      second.push(run(m.reading ?? m.meaning))
    }
  }
  const core = [...shuffle(first), ...shuffle(second)].filter(Boolean)
  return lesson.kind === 'kana' ? [...core, ...readWordExercises(lesson.id)] : core
}

// The lesson's payoff, used: read a real word spelled with the new kana and
// pick how it sounds (romaji, with the meaning in small print). Not tied to an item, so the word isn't added to reviews
// before its own lesson teaches it.
export function readWordExercises(lessonId, count = 2) {
  const payoff = lessonPayoff(lessonId)
  if (!payoff?.unlocked.length) return []
  return shuffle(payoff.unlocked.slice(0, 12))
    .slice(0, count)
    .map((w) =>
      choice({
        item: { id: null },
        kind: 'read-word',
        prompt: { label: 'Read it! How do you say this word?', jp: w.kana, big: true },
        correct: w,
        pool: payoff.readable.filter((x) => x.kana !== w.kana), // never a same-spelling word
        labelOf: (x) => toRomaji(x.kana),
        noteOf: (x) => x.meaning,
        speak: w.speak,
      })
    )
    .filter((e) => e.options.length === 4)
}

// One exercise for an item, picked at random from what fits it — used by
// Review and checkpoints so each item gets tested from a varied angle.
export function exerciseForItem(itemId) {
  const item = getItem(itemId)
  if (!item) return null
  if (item.type === 'grammar') return drillExercise(item, sample(item.drills))
  const makers = Object.values(makersFor(item)).filter(Boolean)
  return run(sample(makers))
}

export function checkpointExercises(lesson, count = 20) {
  const ids = shuffle(lesson.items)
  // Make sure every grammar point appears; fill the rest with words/kanji/kana.
  const grammar = ids.filter((id) => getItem(id)?.type === 'grammar')
  const rest = ids.filter((id) => getItem(id)?.type !== 'grammar')
  const picked = [...grammar, ...rest].slice(0, count)
  return shuffle(picked.map(exerciseForItem).filter(Boolean))
}

// A few earlier items mixed into a lesson so old material keeps coming back:
// due items first (most overdue), then ones the learner often misses. Only
// items taught before this lesson, so replaying lesson 1 never pulls in
// later material.
export function flashbackExercises(srs, lesson, count = 3, now = new Date()) {
  const today = toDateString(now)
  const rows = Object.values(srs).filter((r) => getItem(r.item_id) && taughtBefore(r.item_id, lesson) && r.last_reviewed_at?.slice(0, 10) !== today)
  const due = rows.filter((r) => isDue(r, now)).sort((a, b) => (a.next_review_date ?? '').localeCompare(b.next_review_date ?? ''))
  const weak = rows
    .filter((r) => !isDue(r, now) && r.incorrect_count > 0 && r.incorrect_count >= r.correct_count / 3)
    .sort((a, b) => b.incorrect_count / (b.correct_count + 1) - a.incorrect_count / (a.correct_count + 1))
  return [...due, ...weak]
    .slice(0, count)
    .map((r) => exerciseForItem(r.item_id))
    .filter(Boolean)
    .map((e) => ({ ...e, flashback: true }))
}

// Spreads `extra` evenly through `list`, never at the very start.
export function sprinkle(list, extra) {
  const out = [...list]
  for (let i = extra.length - 1; i >= 0; i--) out.splice(Math.round(((i + 1) * list.length) / (extra.length + 1)), 0, extra[i])
  return out
}

export function reviewExercises(itemIds, limit = 20) {
  return shuffle(itemIds).slice(0, limit).map(exerciseForItem).filter(Boolean)
}

// Comprehension questions for reading / listening lessons.
export function questionExercises(questions, kind) {
  return questions.map((q) => {
    const correct = q.options[q.answer]
    const options = shuffle(q.options)
    return { kind, type: 'choice', itemId: null, prompt: { label: q.q }, options, answer: options.indexOf(correct), english: true }
  })
}
