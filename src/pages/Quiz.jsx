import { useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { getModule } from '../lib/modules'
import { useProgress } from '../hooks/useProgress'
import { speakableTexts } from '../lib/cardSpeech'
import QuizMultipleChoice from '../components/QuizMultipleChoice'
import QuizTypeAnswer from '../components/QuizTypeAnswer'

function quizFields(moduleId, card) {
  switch (moduleId) {
    case 'hiragana':
    case 'katakana':
      return { prompt: card.char, answer: card.romaji, hint: null }
    case 'grammar':
      return { prompt: card.point, answer: card.structure, hint: card.level }
    case 'vocabulary':
      return { prompt: card.word, answer: card.meaning, hint: card.reading }
    case 'kanji':
      return { prompt: card.char, answer: card.meaning, hint: null }
    default:
      return { prompt: '?', answer: '?', hint: null }
  }
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildOptions(allCards, moduleId, card) {
  const correct = quizFields(moduleId, card).answer
  const pool = allCards
    .filter((c) => c.id !== card.id)
    .map((c) => quizFields(moduleId, c).answer)
    .filter((a, i, arr) => a !== correct && arr.indexOf(a) === i)
  const distractors = shuffle(pool).slice(0, 3)
  return shuffle([correct, ...distractors])
}

export default function Quiz() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)
  const { loading, dueCards, cardsWithProgress, recordReview } = useProgress(moduleId, mod?.cards ?? [])
  const [queue, setQueue] = useState(null)
  const [index, setIndex] = useState(0)
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 })

  const deck = useMemo(() => {
    if (queue) return queue
    return dueCards.length > 0 ? dueCards : cardsWithProgress
  }, [queue, dueCards, cardsWithProgress])

  const card = index < deck.length ? deck[index] : null

  const options = useMemo(() => {
    if (!card || !mod) return []
    return buildOptions(mod.cards, moduleId, card)
  }, [card, mod, moduleId])

  if (!mod) return null
  if (loading) return <div className="flex-1 flex items-center justify-center text-ink/40">Loading…</div>

  if (deck.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-lg font-medium">No cards yet</p>
        <Link to={`/module/${moduleId}`} className="text-accent font-medium">
          Back to module
        </Link>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-2xl font-semibold">Quiz complete</p>
        <p className="text-ink/60">
          {sessionStats.correct} correct · {sessionStats.incorrect} incorrect
        </p>
        <Link to={`/module/${moduleId}`} className="mt-4 px-6 py-3 rounded-2xl bg-accent text-white font-medium">
          Back to module
        </Link>
      </div>
    )
  }

  const { prompt, answer, hint } = quizFields(moduleId, card)
  const quizType = index % 2 === 0 ? 'choice' : 'type'
  const speakTexts = speakableTexts(moduleId, card)

  async function handleAnswer(correct) {
    await recordReview(card.id, correct)
    setSessionStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      incorrect: s.incorrect + (correct ? 0 : 1),
    }))
    setIndex((i) => i + 1)
    if (!queue) setQueue(deck)
  }

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <header className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate(`/module/${moduleId}`)}
          aria-label="Back to module"
          className="flex items-center justify-center -ml-2 w-10 h-10 rounded-full text-ink/50 active:bg-ink/5 active:text-ink/80"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="text-sm text-ink/50">
          {index + 1} / {deck.length}
        </span>
      </header>

      <div className="flex-1 flex flex-col justify-center">
        {quizType === 'choice' ? (
          <QuizMultipleChoice
            key={card.id}
            question={prompt}
            hint={hint}
            correctAnswer={answer}
            options={options}
            onAnswer={handleAnswer}
            speak={speakTexts}
          />
        ) : (
          <QuizTypeAnswer
            key={card.id}
            question={prompt}
            hint={hint}
            correctAnswer={answer}
            onAnswer={handleAnswer}
            speak={speakTexts}
          />
        )}
      </div>
    </div>
  )
}
