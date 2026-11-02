import { toRomaji, toHiragana } from 'wanakana'

// Content stores Japanese with inline furigana: 私[わたし]は学生[がくせい]です。
// A run of kanji (plus 々 / ヶ) followed by [reading] becomes one ruby segment.
const RUBY_RE = /([㐀-鿿豈-﫿々〆ヶ]+)\[([^\]]+)\]/g

// → [{ text: '私', reading: 'わたし' }, { text: 'は' }, …]
export function parseFurigana(markup = '') {
  const segments = []
  let last = 0
  for (const match of markup.matchAll(RUBY_RE)) {
    if (match.index > last) segments.push({ text: markup.slice(last, match.index) })
    segments.push({ text: match[1], reading: match[2] })
    last = match.index + match[0].length
  }
  if (last < markup.length) segments.push({ text: markup.slice(last) })
  return segments
}

// Kanji form without annotations: 私は学生です。
export function toPlain(markup = '') {
  return markup.replace(RUBY_RE, '$1')
}

// Reading form: わたしはがくせいです。 (katakana kept as-is)
export function toKana(markup = '') {
  return markup.replace(RUBY_RE, '$2')
}

// What the voice reads: the kana form, minus the 〜 placeholder in affixes.
// Used by both the app and scripts/generate-audio.mjs, so clip keys match.
export function speechText(markup = '') {
  return toKana(markup).replace(/[〜~＿]/g, '').trim()
}

// Splits a passage into sentences (kept with their 。！？), for line-by-line audio.
export function splitSentences(markup = '') {
  return markup.match(/[^。！？]+[。！？]?/g)?.map((s) => s.trim()).filter(Boolean) ?? []
}

// Romaji for a single word or kana — not for sentences, where particles
// (は = wa, を = o) would come out wrong.
export function wordRomaji(markup = '') {
  return toRomaji(toKana(markup).replace(/[〜~]/g, ''))
}

const SMALL_VOWELS = { ぁ: 'あ', ぃ: 'い', ぅ: 'う', ぇ: 'え', ぉ: 'お' }
const VOWEL_KANA = { a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お' }

// Normalises a typed or stored answer so equivalent spellings compare equal:
// - hiragana only; spaces, punctuation and 〜 dropped
// - long-vowel mark ー becomes the vowel it stretches (ノート → のおと), so
//   "noto"-style typing with "-" or a doubled vowel both match
// - small ぁぃぅぇぉ count as full-size (ソファ typed "sofua" is fine)
// - a leftover "t" before ち (from typing "tchi") becomes っ
export function normaliseKana(text = '') {
  let s = toHiragana(toKana(text), { passRomaji: true, convertLongVowelMark: false })
  s = s.replace(/[\s　、。・〜~！？!?]/g, '').replace(/t(?=ち)/g, 'っ')
  s = s.replace(/[ぁぃぅぇぉ]/g, (ch) => SMALL_VOWELS[ch])
  return s.replace(/(.)ー/g, (_, prev) => prev + (VOWEL_KANA[toRomaji(prev).slice(-1)] ?? 'ー'))
}

// Accepted readings for a typed answer: the normalised form, plus the common
// お-row variant for long vowels (ノート typed "nouto").
export function readingVariants(text = '') {
  const base = normaliseKana(text)
  const variants = new Set([base])
  if (toKana(text).includes('ー')) {
    const ou = toHiragana(toKana(text), { passRomaji: true, convertLongVowelMark: true })
    variants.add(normaliseKana(ou))
  }
  return [...variants]
}

export function hasKanji(text = '') {
  return /[㐀-鿿豈-﫿]/.test(text)
}
