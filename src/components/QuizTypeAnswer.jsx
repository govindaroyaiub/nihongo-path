import { useEffect, useState } from 'react'

function normalize(s) {
  return s.trim().toLowerCase()
}

export default function QuizTypeAnswer({ question, hint, correctAnswer, onAnswer }) {
  const [value, setValue] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)

  useEffect(() => {
    setValue('')
    setRevealed(false)
  }, [question])

  function submit(e) {
    e.preventDefault()
    if (revealed || !value.trim()) return
    const correct = normalize(value) === normalize(correctAnswer)
    setWasCorrect(correct)
    setRevealed(true)
    setTimeout(() => onAnswer(correct), 900)
  }

  return (
    <form onSubmit={submit} className="w-full flex flex-col gap-4">
      <div className="py-8 text-center">
        <p className="text-3xl font-medium">{question}</p>
        {hint && <p className="text-sm text-ink/45 mt-2">{hint}</p>}
      </div>
      <input
        type="text"
        inputMode="text"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        value={value}
        disabled={revealed}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your answer"
        className="w-full text-lg py-4 px-4 rounded-2xl border-2 border-ink/10 text-center focus:outline-none focus:border-accent disabled:opacity-70"
        autoFocus
      />
      {revealed ? (
        <p className={`text-center font-medium ${wasCorrect ? 'text-success' : 'text-danger'}`}>
          {wasCorrect ? 'Correct!' : `Answer: ${correctAnswer}`}
        </p>
      ) : (
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-accent text-white font-medium text-lg active:opacity-80 disabled:opacity-50"
          disabled={!value.trim()}
        >
          Check
        </button>
      )}
    </form>
  )
}
