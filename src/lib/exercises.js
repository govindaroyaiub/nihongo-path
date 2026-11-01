import { toHiragana } from 'wanakana'
import { getItem, knownPeers } from './curriculum'
import { toKana, toPlain, normaliseKana, hasKanji, speechText } from './furigana'

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
function choice({ item, prompt, correct, pool, labelOf, speak, kind }) {
  const correctLabel = labelOf(correct)
  const seen = new Set([correctLabel])
  const distractors = []
  for (const candidate of shuffle(pool)) {
    const label = labelOf(candidate)
    if (!label || seen.has(label)) continue
    seen.add(label)
    distractors.push(label)
    if (distractors.length === 3) break
  }
  const options = shuffle([correctLabel, ...distractors])
  return { kind, type: 'choice', itemId: item.id, prompt, options, answer: options.indexOf(correctLabel), speak }
}

export const meaningOf = (item) =>
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
        prompt: { label: 'Which sound is this?', jp: item.char, big: true },
        labelOf: (k) => k.romaji,
      }),
    listen: () =>
      choice({
        kind: 'kana-listen', item, pool, correct: item, speak: item.char,
        prompt: { label: 'Tap what you hear', audio: item.char },
        labelOf: (k) => k.char,
      }),
    type: () => ({
      kind: 'kana-type', type: 'type', itemId: item.id, speak: item.char,
      prompt: { label: 'Type the sound in romaji', jp: item.char, big: true },
      input: 'romaji',
      accept: [toHiragana(item.char)],
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
        kind: 'vocab-listen', item, pool, correct: item, speak: speakOf(item),
        prompt: { label: 'What does this mean?', audio: speakOf(item) },
        labelOf: meaningOf,
      }),
    type: canTypeWord(item)
      ? () => ({
          kind: 'vocab-type', type: 'type', itemId: item.id, speak: speakOf(item),
          prompt: hasKanji(item.word)
            ? { label: 'Type the reading', jp: toPlain(item.word), big: true, hint: item.meaning }
            : { label: 'Type the Japanese word', en: item.meaning, audio: speakOf(item) },
          input: 'kana',
          accept: [normaliseKana(item.word)],
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
  return [...shuffle(first), ...shuffle(second)].filter(Boolean)
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
