import hiragana from '../data/hiragana.json'
import katakana from '../data/katakana.json'
import grammar from '../data/grammar.json'
import vocabulary from '../data/vocabulary.json'
import kanji from '../data/kanji.json'

export const MODULES = [
  {
    id: 'hiragana',
    title: 'Hiragana',
    subtitle: 'The 46 base sounds + variations',
    glyph: 'あ',
    color: 'oklch(58% 0.14 40)',
    cards: hiragana,
  },
  {
    id: 'katakana',
    title: 'Katakana',
    subtitle: 'Loanwords & foreign names',
    glyph: 'ア',
    color: 'oklch(60% 0.11 75)',
    cards: katakana,
  },
  {
    id: 'grammar',
    title: 'Grammar',
    subtitle: 'N5 to N3 patterns',
    glyph: '文',
    color: 'oklch(52% 0.08 230)',
    cards: grammar,
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    subtitle: 'Everyday words by level',
    glyph: '語',
    color: 'oklch(50% 0.09 145)',
    cards: vocabulary,
  },
  {
    id: 'kanji',
    title: 'Kanji',
    subtitle: 'Frequency-ordered characters',
    glyph: '漢',
    color: 'oklch(48% 0.10 310)',
    cards: kanji,
  },
]

export function getModule(moduleId) {
  return MODULES.find((m) => m.id === moduleId)
}
