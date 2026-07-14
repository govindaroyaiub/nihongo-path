// Returns the Japanese text worth voicing for a card, in play order.
// Kana/kanji: just the character. Vocab: the word, then its example sentence.
// Grammar: the example sentence (the point name itself isn't spoken Japanese).
export function speakableTexts(moduleId, card) {
  if (!card) return []
  switch (moduleId) {
    case 'hiragana':
    case 'katakana':
      return [card.char]
    case 'grammar':
      return [card.example_jp]
    case 'vocabulary':
      return [card.word, card.example_jp]
    case 'kanji':
      return [card.char]
    default:
      return []
  }
}
