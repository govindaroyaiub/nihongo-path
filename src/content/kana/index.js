import hiragana from './hiragana.json'
import katakana from './katakana.json'
import { kanaHint } from './hooks'

// Lessons follow the gojūon table a row or two at a time, then the voiced
// variants, then the combination sounds — the order every textbook teaches.
const LESSON_PLAN = [
  { title: 'Vowels', rows: ['a'] },
  { title: 'K row', rows: ['k'] },
  { title: 'S row', rows: ['s'] },
  { title: 'T row', rows: ['t'] },
  { title: 'N row', rows: ['n'] },
  { title: 'H row', rows: ['h'] },
  { title: 'M row', rows: ['m'] },
  { title: 'Y & R rows', rows: ['y', 'r'] },
  { title: 'W row & ん', rows: ['w'] },
  { title: 'Voiced: G & Z', rows: ['g', 'z'] },
  { title: 'Voiced: D, B & P', rows: ['d', 'b', 'p'] },
  { title: 'Combos: きゃ → ひゃ', rows: ['yoon1'] },
  { title: 'Combos: みゃ → ぴゃ', rows: ['yoon2'] },
]

// Which table row a kana belongs to, derived from its romaji + group.
function rowOf(card) {
  if (card.group === 'yoon') {
    return /^(ky|sh|ch|ny|hy)/.test(card.romaji) ? 'yoon1' : 'yoon2'
  }
  if (card.group === 'handakuten') return 'p'
  const r = card.romaji
  if (card.group === 'dakuten') {
    if (r.startsWith('g')) return 'g'
    if ('ぢづヂヅ'.includes(card.char)) return 'd'
    if (r.startsWith('z') || r.startsWith('j')) return 'z'
    if (r.startsWith('d')) return 'd'
    if (r.startsWith('b')) return 'b'
  }
  if (/^[aiueo]$/.test(r)) return 'a'
  if (r === 'n') return 'w' // ん rides with the W row
  if (r === 'shi') return 's'
  if (r === 'chi' || r === 'tsu') return 't'
  if (r === 'fu') return 'h'
  return r[0]
}

const NOTES = {
  hiragana:
    'Hiragana is the core Japanese alphabet: 46 characters, each one a syllable. Every Japanese word can be written in it, and grammar endings always are.',
  katakana:
    'Katakana spells the same sounds as hiragana, in sharper shapes. It is used for foreign loanwords (コーヒー coffee), foreign names and emphasis. A long dash ー stretches a vowel, and a small ッ doubles the next consonant.',
}

function buildKanaUnit(script, cards, number) {
  const romajiOf = (char) => cards.find((c) => c.char === char)?.romaji
  const items = cards.map((c) => ({ ...c, type: 'kana', script, hint: kanaHint(c, romajiOf) }))
  const unitId = `n5-${script}`
  const lessons = LESSON_PLAN.map((plan, i) => ({
    id: `${unitId}-l${String(i + 1).padStart(2, '0')}`,
    kind: 'kana',
    title: plan.title,
    items: items.filter((c) => plan.rows.includes(rowOf(c))).map((c) => c.id),
  })).filter((l) => l.items.length > 0)

  lessons.push({
    id: `${unitId}-check`,
    kind: 'checkpoint',
    title: `${script === 'hiragana' ? 'Hiragana' : 'Katakana'} checkpoint`,
    items: items.map((c) => c.id),
  })

  return {
    id: unitId,
    level: 'N5',
    number,
    kana: true,
    title: script === 'hiragana' ? 'Hiragana' : 'Katakana',
    goal:
      script === 'hiragana'
        ? 'Read and hear all 46 hiragana plus their voiced and combined forms.'
        : 'Read katakana so you can sound out loanwords and foreign names.',
    note: NOTES[script],
    glyph: script === 'hiragana' ? 'あ' : 'ア',
    items,
    lessons,
  }
}

export const KANA_UNITS = [buildKanaUnit('hiragana', hiragana, 'K1'), buildKanaUnit('katakana', katakana, 'K2')]
