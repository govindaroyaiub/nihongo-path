import { useEffect, useRef, useState } from 'react'
import { bind, unbind, toHiragana } from 'wanakana'
import Prompt from './Prompt'
import { normaliseKana } from '../../lib/furigana'

// Typed answer. Kana mode converts romaji to hiragana as you type (no
// Japanese keyboard needed); romaji mode checks the sound you typed.
export default function TypeExercise({ exercise, onAnswer, answered }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)
  const kana = exercise.input === 'kana'

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    if (kana) bind(el, { IMEMode: 'toHiragana' })
    el.focus({ preventScroll: true })
    return () => {
      if (kana) unbind(el)
    }
  }, [kana])

  function check(e) {
    e.preventDefault()
    if (answered) return
    const typed = inputRef.current.value
    if (!typed.trim()) return
    const guess = kana ? normaliseKana(typed) : toHiragana(typed.trim().toLowerCase())
    onAnswer(exercise.accept.includes(guess), exercise.display)
  }

  return (
    <form onSubmit={check} className="flex flex-col gap-4">
      <Prompt prompt={exercise.prompt} />
      <input
        ref={inputRef}
        value={kana ? undefined : value}
        onChange={kana ? undefined : (e) => setValue(e.target.value)}
        disabled={Boolean(answered)}
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        lang={kana ? 'ja' : 'en'}
        placeholder={kana ? 'type in romaji → かな' : 'romaji'}
        className={`tile w-full text-center text-2xl font-jp font-bold py-4 outline-none ${
          answered ? (answered.correct ? '!border-matcha-deep text-matcha-deep' : '!border-torii-deep text-torii-deep animate-shake') : 'focus:!border-sky'
        }`}
      />
      {!answered && (
        <button type="submit" className="btn-sky w-full py-4">
          Check
        </button>
      )}
    </form>
  )
}
