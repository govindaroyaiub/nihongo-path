import { useEffect, useState } from 'react'
import Prompt from './Prompt'
import { SmartText } from '../JpText'

export default function ChoiceExercise({ exercise, onAnswer, answered }) {
  const [selected, setSelected] = useState(null)
  const compact = !exercise.notes && exercise.options.every((o) => o.length <= 4)

  function choose(i) {
    if (answered) return
    setSelected(i)
    const note = exercise.notes?.[exercise.answer]
    onAnswer(i === exercise.answer, exercise.options[exercise.answer] + (note ? ` (${note})` : ''))
  }

  // Keyboard: 1–4 picks an option (desktop).
  useEffect(() => {
    function onKey(e) {
      const n = Number(e.key)
      if (n >= 1 && n <= exercise.options.length) choose(n - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="flex flex-col gap-5">
      <Prompt prompt={exercise.prompt} />
      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {exercise.options.map((option, i) => {
          const isAnswer = answered && i === exercise.answer
          const isWrong = answered && i === selected && i !== exercise.answer
          return (
            <button
              key={option + i}
              type="button"
              disabled={Boolean(answered)}
              onClick={() => choose(i)}
              className={`tile w-full px-4 font-bold text-left flex items-center gap-3 ${compact ? 'py-5 justify-center text-3xl' : 'py-4 text-[17px]'} ${
                isAnswer ? '!bg-matcha/20 !border-matcha-deep text-matcha-deep animate-jump' : isWrong ? '!bg-torii/15 !border-torii-deep text-torii-deep animate-shake' : answered ? 'opacity-50' : 'hover:bg-sunken'
              }`}
            >
              {!compact && (
                <span className="w-7 h-7 rounded-lg border-2 border-current/30 text-xs font-extrabold flex items-center justify-center shrink-0 opacity-60">{i + 1}</span>
              )}
              {/* Same Gothic font as the prompt, so character shapes always match. */}
              <span className="min-w-0">
                <SmartText text={option} className="leading-snug" />
                {exercise.notes?.[i] && <span className="ml-1.5 text-xs font-bold opacity-55">({exercise.notes[i]})</span>}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
