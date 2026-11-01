import { useMemo, useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useStore, recordReview, getState } from '../lib/store'
import { dueItemIds } from '../lib/progress'
import { reviewExercises } from '../lib/exercises'
import { speak, stopSpeaking } from '../lib/speech'
import { playDing, playMiss, playChime } from '../lib/sound'
import ProgressBar from '../components/ProgressBar'
import Exercise from '../components/lesson/Exercise'
import FeedbackSheet from '../components/lesson/FeedbackSheet'
import Mascot from '../components/Mascot'

const SESSION_SIZE = 20

export default function Review() {
  const srs = useStore((s) => s.srs)
  const navigate = useNavigate()
  const due = dueItemIds(srs)
  const learned = Object.keys(srs).length
  const mastered = Object.values(srs).filter((r) => r.status === 'mastered').length

  return (
    <div className="pt-[max(env(safe-area-inset-top),1.5rem)] pb-8">
      <h1 className="font-title text-3xl">Review <span className="text-sky">復習</span></h1>
      <p className="text-sm text-ink/50 mt-1">Spaced repetition: each item comes back right before you'd forget it.</p>

      <div className="mt-6 panel p-6 flex flex-col items-center text-center">
        {due.length > 0 ? (
          <>
            <Mascot pose="think" size={90} />
            <p className="font-title text-6xl text-sky mt-3">{due.length}</p>
            <p className="text-ink/50">items due now</p>
            <button
              type="button"
              onClick={() => navigate('/review/session')}
              className="btn-sky mt-6 w-full py-4"
            >
              Review {Math.min(due.length, SESSION_SIZE)}
            </button>
          </>
        ) : (
          <>
            <Mascot pose="celebrate" size={90} />
            <p className="font-bold text-lg mt-4">{learned ? 'All caught up' : 'Nothing to review yet'}</p>
            <p className="text-sm text-ink/50 mt-1 max-w-xs">
              {learned ? 'Come back later — new reviews appear as items come due.' : 'Finish a lesson and its items will start showing up here.'}
            </p>
            <Link to="/" className="mt-5 text-sm font-extrabold text-accent">
              Go to lessons →
            </Link>
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat label="Learned" value={learned} />
        <Stat label="Mastered" value={mastered} hint="21+ day interval" />
      </div>
    </div>
  )
}

function Stat({ label, value, hint }) {
  return (
    <div className="panel !rounded-2xl p-4">
      <p className="text-xs text-ink/45">{label}</p>
      <p className="font-title text-3xl mt-1">{value}</p>
      {hint && <p className="text-[11px] text-ink/35">{hint}</p>}
    </div>
  )
}

export function ReviewSession() {
  const navigate = useNavigate()
  const onExit = () => navigate('/review')
  const queue = useMemo(() => reviewExercises(dueItemIds(getState().srs), SESSION_SIZE), [])
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(null)
  const [stats, setStats] = useState({ right: 0, wrong: 0 })
  const settings = useStore((s) => s.settings)
  const done = index >= queue.length
  const chimed = useRef(false)

  useEffect(() => stopSpeaking, [])
  useEffect(() => {
    if (done && !chimed.current && settings.sounds) {
      chimed.current = true
      playChime()
    }
  }, [done, settings.sounds])

  const exercise = queue[index]

  function handleAnswer(correct, correctLabel) {
    setAnswered({ correct, correctLabel })
    recordReview(exercise.itemId, correct)
    setStats((s) => (correct ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 }))
    if (settings.sounds) (correct ? playDing : playMiss)()
    if (exercise.speak && settings.autoplay) setTimeout(() => speak(exercise.speak), 250)
  }

  return (
    <div className="flex-1 flex flex-col min-h-[100svh]">
      <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur-md px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 flex items-center gap-3">
        <button type="button" onClick={onExit} aria-label="End review" className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-ink/50">
          <X size={22} />
        </button>
        <div className="flex-1">
          <ProgressBar value={index} max={queue.length} color="oklch(45% 0.09 260)" />
        </div>
      </header>
      <main className="flex-1 px-5 pb-48">
        {!done && exercise && (
          <div key={index}>
            <Exercise exercise={exercise} onAnswer={handleAnswer} answered={answered} />
          </div>
        )}
        {done && (
          <div className="flex flex-col items-center text-center pt-10 gap-2">
            <Mascot pose="celebrate" size={100} />
            <h2 className="font-title text-3xl mt-3">Review done</h2>
            <p className="text-ink/55">
              {stats.right} right · {stats.wrong} to practise more
            </p>
            <button type="button" onClick={() => navigate('/')} className="btn-primary mt-8 w-full py-4">
              Back to the path
            </button>
            <button type="button" onClick={onExit} className="btn-ghost w-full py-3.5 mt-3">
              Review overview
            </button>
          </div>
        )}
      </main>
      {answered && !done && (
        <FeedbackSheet
          answered={answered}
          speakText={exercise.speak}
          onContinue={() => {
            stopSpeaking()
            setAnswered(null)
            setIndex(index + 1)
          }}
        />
      )}
    </div>
  )
}
