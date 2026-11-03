import { LESSONS, getItem, allItems } from './curriculum'
import { toKana, speechText } from './furigana'

// "What can I read now?" — real course words spelled only with kana the
// learner has met. Shown as the payoff of every kana lesson, so each new row
// of characters visibly unlocks words.

// Course words that make sense on their own (no 〜 affixes), with a short meaning.
const WORDS = allItems()
  .filter((i) => i.type === 'vocab' && !/[〜~＿]/.test(i.word))
  .map((v, order) => ({
    id: v.id,
    order, // course order: earliest (most basic) words first
    kana: toKana(v.word),
    meaning: v.meaning.split(/[,;(]/)[0].trim(),
    speak: speechText(v.word),
  }))
  .filter((w) => w.kana && w.meaning)

const KANA_LESSONS = LESSONS.filter((l) => l.kind === 'kana')

// ー only stretches a vowel, so it needs no learning of its own.
const spelledWith = (known) => (w) => [...w.kana.replace(/ー/g, '')].every((ch) => known.has(ch))

function kanaOf(lessons) {
  const known = new Set()
  for (const l of lessons) for (const id of l.items) for (const ch of getItem(id).char) known.add(ch)
  return known
}

const cache = new Map()

// Kana known once `lessonId` is done, and the words that unlocks.
export function lessonPayoff(lessonId) {
  if (cache.has(lessonId)) return cache.get(lessonId)
  const at = KANA_LESSONS.findIndex((l) => l.id === lessonId)
  if (at < 0) return null
  const before = kanaOf(KANA_LESSONS.slice(0, at))
  const after = kanaOf(KANA_LESSONS.slice(0, at + 1))
  const readable = WORDS.filter(spelledWith(after))
  const wasReadable = new Set(WORDS.filter(spelledWith(before)).map((w) => w.id))
  // Shortest words first: easiest to sound out.
  const unlocked = readable.filter((w) => !wasReadable.has(w.id)).sort((a, b) => a.kana.length - b.kana.length)
  const payoff = { known: after, readable, unlocked }
  cache.set(lessonId, payoff)
  return payoff
}

// A short readable word that uses `char`, for its teaching card.
export function exampleWord(char, lessonId) {
  const payoff = lessonPayoff(lessonId)
  if (!payoff) return null
  return payoff.readable.filter((w) => w.kana.includes(char)).sort((a, b) => a.kana.length - b.kana.length)[0] ?? null
}

// The words finishing a whole kana unit unlocks (katakana's are the loanwords,
// not the hiragana words already readable before it).
export function unitPayoff(unit) {
  return unit.lessons.filter((l) => l.kind === 'kana').flatMap((l) => lessonPayoff(l.id).unlocked)
}

// How many course words the learner can read right now: spelled with kana from
// passed lessons, or already learned as vocabulary.
export function readableCount(lessons, srs) {
  const known = kanaOf(KANA_LESSONS.filter((l) => lessons[l.id]?.passed))
  return WORDS.filter((w) => srs[w.id] || spelledWith(known)(w)).length
}
