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

// Normalises an answer for comparison: hiragana, no spaces, punctuation or 〜.
export function normaliseKana(text = '') {
  return toHiragana(toKana(text), { passRomaji: true }).replace(/[\s　、。・〜~！？!?]/g, '')
}

export function hasKanji(text = '') {
  return /[㐀-鿿豈-﫿]/.test(text)
}
