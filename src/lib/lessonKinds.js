import { Type, BookOpen, PenTool, Puzzle, FileText, Headphones, Trophy, MapPinned } from 'lucide-react'

// color = a journey COLOR key, so lesson kinds share the app palette.
export const LESSON_KINDS = {
  kana: { label: 'Kana', icon: Type, color: 'torii' },
  vocab: { label: 'Words', icon: BookOpen, color: 'matcha' },
  kanji: { label: 'Kanji', icon: PenTool, color: 'grape' },
  grammar: { label: 'Grammar', icon: Puzzle, color: 'sky' },
  reading: { label: 'Reading', icon: FileText, color: 'sun' },
  listening: { label: 'Listening', icon: Headphones, color: 'sakura' },
  travel: { label: 'Travel', icon: MapPinned, color: 'torii' },
  checkpoint: { label: 'Checkpoint', icon: Trophy, color: 'sun' },
}
