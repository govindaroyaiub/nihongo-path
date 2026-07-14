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
    color: '#c2694a',
    cards: hiragana,
  },
  {
    id: 'katakana',
    title: 'Katakana',
    subtitle: 'Loanwords & foreign names',
    color: '#a4693b',
    cards: katakana,
  },
  {
    id: 'grammar',
    title: 'Grammar',
    subtitle: 'N5 to N3 patterns',
    color: '#5a7d8c',
    cards: grammar,
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    subtitle: 'Everyday words by level',
    color: '#5a8c69',
    cards: vocabulary,
  },
  {
    id: 'kanji',
    title: 'Kanji',
    subtitle: 'Frequency-ordered characters',
    color: '#7a5a8c',
    cards: kanji,
  },
]

export function getModule(moduleId) {
  return MODULES.find((m) => m.id === moduleId)
}
