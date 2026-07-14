import { useEffect, useState } from 'react'
import { Volume2 } from 'lucide-react'
import { speakSequence } from '../lib/speech'

export default function QuizMultipleChoice({ question, hint, correctAnswer, options, onAnswer, speak }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setSelected(null)
    setRevealed(false)
  }, [question])

  function choose(option) {
    if (revealed) return
    setSelected(option)
    setRevealed(true)
    speakSequence(speak)
    setTimeout(() => onAnswer(option === correctAnswer), 650)
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="py-8 text-center">
        <p className="font-display text-4xl font-medium">{question}</p>
        {hint && <p className="text-sm text-ink/45 mt-2">{hint}</p>}
      </div>
      {revealed && speak?.length > 0 && (
        <button
          type="button"
          onClick={() => speakSequence(speak)}
          className="self-center flex items-center gap-1.5 text-sm text-ink/50 px-3 py-1.5"
        >
          <Volume2 size={16} />
          Replay
        </button>
      )}
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => {
          const isCorrect = revealed && option === correctAnswer
          const isWrong = revealed && option === selected && option !== correctAnswer
          return (
            <button
              key={option}
              type="button"
              disabled={revealed}
              onClick={() => choose(option)}
              className={`w-full text-lg py-4 rounded-2xl border-2 font-medium transition-all active:scale-[0.98] ${
                isCorrect
                  ? 'bg-success/10 border-success text-success'
                  : isWrong
                    ? 'bg-danger/10 border-danger text-danger'
                    : 'bg-white border-ink/10 active:bg-ink/5'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
