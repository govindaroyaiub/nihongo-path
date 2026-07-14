import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { getModule } from '../lib/modules'
import { useProgress } from '../hooks/useProgress'
import { speakSequence, SLOW_RATE } from '../lib/speech'
import { speakableTexts } from '../lib/cardSpeech'
import { playDing, playChime, playFanfare } from '../lib/sound'
import FlashCard from '../components/FlashCard'
import Mascot from '../components/Mascot'
import Confetti from '../components/Confetti'

function frontBack(moduleId, card) {
  switch (moduleId) {
    case 'hiragana':
    case 'katakana':
      return {
        front: <span className="font-display text-8xl font-medium animate-pop-in">{card.char}</span>,
        back: <span className="font-display text-5xl font-medium">{card.romaji}</span>,
      }
    case 'grammar':
      return {
        front: (
          <div className="flex flex-col gap-3 items-center animate-pop-in">
            <span className="text-xs uppercase tracking-wide text-ink/40">{card.level}</span>
            <span className="font-display text-2xl font-medium">{card.point}</span>
          </div>
        ),
        back: (
          <div className="flex flex-col gap-3 items-center">
            <span className="font-display text-lg font-medium">{card.structure}</span>
            <span className="text-xl">{card.example_jp}</span>
            <span className="text-sm text-ink/60">{card.example_en}</span>
          </div>
        ),
      }
    case 'vocabulary':
      return {
        front: (
          <div className="flex flex-col gap-2 items-center animate-pop-in">
            <span className="text-xs uppercase tracking-wide text-ink/40">{card.level}</span>
            <span className="font-display text-5xl font-medium">{card.word}</span>
          </div>
        ),
        back: (
          <div className="flex flex-col gap-2 items-center">
            <span className="text-2xl">{card.reading}</span>
            <span className="font-display text-lg font-medium">{card.meaning}</span>
            <span className="text-base mt-2">{card.example_jp}</span>
            <span className="text-sm text-ink/60">{card.example_en}</span>
          </div>
        ),
      }
    case 'kanji':
      return {
        front: <span className="font-display text-8xl font-medium animate-pop-in">{card.char}</span>,
        back: (
          <div className="flex flex-col gap-2 items-center">
            <span className="text-sm">On: {card.onyomi}</span>
            <span className="text-sm">Kun: {card.kunyomi}</span>
            <span className="font-display text-xl font-medium mt-1">{card.meaning}</span>
            <span className="text-xs text-ink/50">{card.stroke_count} strokes</span>
          </div>
        ),
      }
    default:
      return { front: null, back: null }
  }
}

export default function Flashcards() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)
  const { loading, dueCards, cardsWithProgress, recordReview } = useProgress(moduleId, mod?.cards ?? [])
  const [queue, setQueue] = useState(null)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 })
  const [reactionPose, setReactionPose] = useState(null)
  const [reactionId, setReactionId] = useState(0)
  const reactionTimeout = useRef(null)

  const deck = useMemo(() => {
    if (queue) return queue
    return dueCards.length > 0 ? dueCards : cardsWithProgress
  }, [queue, dueCards, cardsWithProgress])

  const complete = !loading && deck.length > 0 && index >= deck.length
  const allMastered = complete && cardsWithProgress.length > 0 && cardsWithProgress.every((c) => c.progress?.status === 'mastered')

  useEffect(() => {
    if (!complete) return
    if (allMastered) playFanfare()
    else playChime()
    // only fire once when the complete screen first appears
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete])

  useEffect(() => () => clearTimeout(reactionTimeout.current), [])

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

  if (complete) {
    return (
      <div className="relative flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center overflow-hidden">
        {allMastered && <Confetti count={40} />}
        <Mascot pose="celebrate" size={allMastered ? 140 : 100} animate={false} />
        <p className="text-2xl font-semibold">{allMastered ? 'Module mastered!' : 'Session complete'}</p>
        <p className="text-ink/60">
          {sessionStats.correct} correct · {sessionStats.incorrect} to review again
        </p>
        <Link to={`/module/${moduleId}`} className="mt-4 px-6 py-3 rounded-2xl bg-accent text-white font-medium">
          Back to module
        </Link>
      </div>
    )
  }

  const card = deck[index]
  const { front, back } = frontBack(moduleId, card)
  const speakTexts = speakableTexts(moduleId, card)

  function handleFlip() {
    const next = !flipped
    setFlipped(next)
    if (next) speakSequence(speakTexts)
  }

  function triggerReaction(pose) {
    clearTimeout(reactionTimeout.current)
    setReactionId((id) => id + 1)
    setReactionPose(pose)
    reactionTimeout.current = setTimeout(() => setReactionPose(null), 1100)
  }

  async function handleSwipe(direction) {
    const correct = direction === 'correct'
    const prevStatus = card.progress?.status
    const updated = await recordReview(card.id, correct)
    const justMastered = updated?.status === 'mastered' && prevStatus !== 'mastered'

    if (justMastered) playFanfare()
    else if (correct) playDing()

    triggerReaction(correct ? 'celebrate' : 'oops')

    setSessionStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      incorrect: s.incorrect + (correct ? 0 : 1),
    }))
    setFlipped(false)
    setIndex((i) => i + 1)
    if (!queue) setQueue(deck)
  }

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <header className="flex items-center justify-between mb-6">
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

      <div className="relative flex-1 flex flex-col items-center justify-center">
        {reactionPose && (
          <div className="absolute top-0 inset-x-0 flex justify-center z-10 pointer-events-none">
            <Mascot key={reactionId} pose={reactionPose} size={64} />
          </div>
        )}
        <FlashCard
          key={card.id}
          front={front}
          back={back}
          flipped={flipped}
          onFlip={handleFlip}
          onSwipe={handleSwipe}
          onReplay={() => speakSequence(speakTexts)}
          onReplaySlow={() => speakSequence(speakTexts, { rate: SLOW_RATE })}
        />
      </div>
    </div>
  )
}
