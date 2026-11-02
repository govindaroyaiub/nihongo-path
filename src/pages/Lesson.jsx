import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { X, ChevronLeft, ChevronRight, Flame, Zap, Target } from 'lucide-react'
import { getLesson, getUnit, getItem, nextLessonId } from '../lib/curriculum'
import { lessonExercises, checkpointExercises, questionExercises } from '../lib/exercises'
import { useStore, completeLesson, passes, PASS_PERCENT } from '../lib/store'
import { lessonStatus } from '../lib/progress'
import { LESSON_KINDS } from '../lib/lessonKinds'
import { COLOR, stopFor } from '../lib/journey'
import { stopSpeaking, speak } from '../lib/speech'
import { playDing, playMiss, playChime, playFanfare } from '../lib/sound'
import ProgressBar from '../components/ProgressBar'
import Exercise from '../components/lesson/Exercise'
import FeedbackSheet from '../components/lesson/FeedbackSheet'
import TeachCard from '../components/lesson/TeachCard'
import GrammarTeach from '../components/lesson/GrammarTeach'
import ReadingTeach from '../components/lesson/ReadingTeach'
import ListeningTeach from '../components/lesson/ListeningTeach'
import TravelTeach from '../components/lesson/TravelTeach'
import Mascot, { MascotSays } from '../components/Mascot'
import Confetti from '../components/Confetti'
import { SfxBurst, Sparkles } from '../components/Anime'

export default function Lesson() {
  const { lessonId } = useParams()
  const lessons = useStore((s) => s.lessons)
  const lesson = getLesson(lessonId)
  if (!lesson) return <Navigate to="/" replace />
  if (lessonStatus(lessonId, lessons) === 'locked') return <Navigate to={`/unit/${lesson.unitId}`} replace />
  // Remount per lesson so state never leaks between lessons.
  return <LessonRun key={lessonId} lesson={lesson} />
}

function buildExercises(lesson, unit) {
  if (lesson.kind === 'checkpoint') return checkpointExercises(lesson)
  if (lesson.kind === 'reading') return questionExercises(unit.reading.questions, 'reading')
  if (lesson.kind === 'listening') return questionExercises(unit.listening.questions, 'listening')
  if (lesson.kind === 'travel') return questionExercises(unit.place.reading.questions, 'travel')
  return lessonExercises(lesson)
}

function LessonRun({ lesson }) {
  const navigate = useNavigate()
  const unit = getUnit(lesson.unitId)
  const sounds = useStore((s) => s.settings.sounds)
  const autoplay = useStore((s) => s.settings.autoplay)
  const teachItems = useMemo(() => (['kana', 'vocab', 'kanji'].includes(lesson.kind) ? lesson.items.map(getItem) : []), [lesson])
  const hasTeach = lesson.kind !== 'checkpoint'
  const [phase, setPhase] = useState(hasTeach ? 'teach' : 'intro')
  const [teachIndex, setTeachIndex] = useState(0)

  const initial = useMemo(() => buildExercises(lesson, unit), [lesson, unit])
  const [queue, setQueue] = useState(initial)
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(null)
  const [combo, setCombo] = useState(0)
  const bestCombo = useRef(0)
  const firstTry = useRef({}) // exercise position → correct on first attempt
  const itemResults = useRef({}) // itemId → all first attempts correct
  const [result, setResult] = useState(null)

  useEffect(() => stopSpeaking, [])

  const exercise = queue[index]
  const kindMeta = LESSON_KINDS[lesson.kind]
  const kc = COLOR[kindMeta.color]
  const lessonNumber = unit.lessons.findIndex((l) => l.id === lesson.id) + 1

  function handleAnswer(correct, correctLabel) {
    setAnswered({ correct, correctLabel })
    const nextCombo = correct ? combo + 1 : 0
    setCombo(nextCombo)
    bestCombo.current = Math.max(bestCombo.current, nextCombo)
    if (sounds) (correct ? playDing : playMiss)()
    if (exercise.speak && autoplay) setTimeout(() => speak(exercise.speak), sounds ? 250 : 0)
    // Only the first pass through the original exercises counts toward the score.
    if (index < initial.length) {
      firstTry.current[index] = correct
      if (exercise.itemId) itemResults.current[exercise.itemId] = (itemResults.current[exercise.itemId] ?? true) && correct
    }
    // Missed in a normal lesson → asked again at the end. Checkpoints don't retry.
    if (!correct && lesson.kind !== 'checkpoint') setQueue((q) => [...q, { ...exercise, retry: true }])
  }

  function next() {
    stopSpeaking()
    setAnswered(null)
    if (index + 1 < queue.length) {
      setIndex(index + 1)
      return
    }
    const correct = Object.values(firstTry.current).filter(Boolean).length
    const score = initial.length ? correct / initial.length : 1
    const xp = completeLesson(lesson.id, { kind: lesson.kind, score, results: itemResults.current })
    const passed = passes(lesson.kind, score)
    if (sounds) (passed && (lesson.kind === 'checkpoint' || score === 1) ? playFanfare : playChime)()
    setResult({ score, correct, total: initial.length, passed, xp, combo: bestCombo.current })
    setPhase('result')
  }

  function retry() {
    firstTry.current = {}
    itemResults.current = {}
    bestCombo.current = 0
    setCombo(0)
    setQueue(buildExercises(lesson, unit))
    setIndex(0)
    setResult(null)
    setPhase(hasTeach ? 'teach' : 'intro')
    setTeachIndex(0)
  }

  const progress = phase === 'practice' ? index / queue.length : phase === 'result' ? 1 : 0

  return (
    <div className="flex-1 flex flex-col min-h-[100svh]">
      <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Close lesson"
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-ink/50 hover:bg-sunken"
          >
            <X size={24} strokeWidth={2.6} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="eyebrow text-[10px] whitespace-nowrap truncate">
              <span className="text-ink/45">
                {unit.kana ? 'Prologue' : `Ep ${unit.number}`} · {lessonNumber}/{unit.lessons.length} ·{' '}
              </span>
              <span className={kc.text}>{kindMeta.label}</span>
            </p>
            <p className="font-extrabold font-jp text-sm leading-tight truncate">{lesson.title.replace(/\[[^\]]*\]/g, '')}</p>
          </div>
          <div className="w-24 sm:w-44 shrink-0 rounded-full border-2 border-outline bg-surface">
            <ProgressBar value={progress * 100} max={100} color={kc.bg} height="h-2.5" />
          </div>
          {combo >= 2 && phase === 'practice' && (
            <span key={combo} className="flex items-center gap-0.5 font-title text-sm text-torii animate-pop-in whitespace-nowrap">
              <Flame size={18} strokeWidth={2.6} className="fill-torii" />
              {combo}
            </span>
          )}
        </div>
      </header>

      <main className={`flex-1 w-full max-w-2xl mx-auto px-5 pt-2 ${answered ? 'pb-56' : 'pb-36'}`}>
        {phase === 'teach' && (
          <TeachPhase lesson={lesson} unit={unit} items={teachItems} index={teachIndex} setIndex={setTeachIndex} onDone={() => setPhase('practice')} />
        )}

        {phase === 'intro' && <CheckpointIntro unit={unit} count={initial.length} onStart={() => setPhase('practice')} />}

        {phase === 'practice' && exercise && (
          <div key={index}>
            {exercise.retry && (
              <div className="flex justify-center mb-2">
                <MascotSays pose="think" size={44}>
                  Let&apos;s try this one again!
                </MascotSays>
              </div>
            )}
            {lesson.kind === 'listening' && (
              <div className="mb-2">
                <ListeningTeach listening={unit.listening} compact />
              </div>
            )}
            <Exercise exercise={exercise} onAnswer={handleAnswer} answered={answered} />
          </div>
        )}

        {phase === 'result' && result && <ResultPhase lesson={lesson} unit={unit} result={result} onRetry={retry} />}
      </main>

      {phase === 'practice' && answered && <FeedbackSheet answered={answered} speakText={exercise.speak} combo={combo} onContinue={next} />}
    </div>
  )
}

function Footer({ children }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-bg via-bg to-transparent pt-10">
      <div className="max-w-2xl mx-auto px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] flex gap-3">{children}</div>
    </div>
  )
}

function TeachPhase({ lesson, unit, items, index, setIndex, onDone }) {
  // Keyboard: → / Enter next, ← back.
  useEffect(() => {
    function onKey(e) {
      if (!items.length) return
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (index < items.length - 1) setIndex(index + 1)
        else onDone()
      }
      if (e.key === 'ArrowLeft' && index > 0) setIndex(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const nextBtn = (label, onClick) => (
    <button type="button" onClick={onClick} className="btn-primary flex-1 py-4 text-base">
      {label}
      <ChevronRight size={20} strokeWidth={3} />
    </button>
  )

  if (lesson.kind === 'grammar') {
    return (
      <>
        <GrammarTeach item={getItem(lesson.items[0])} />
        <Footer>{nextBtn('Practice this', onDone)}</Footer>
      </>
    )
  }
  if (lesson.kind === 'reading') {
    return (
      <>
        <h2 className="font-title text-2xl mb-3">{unit.reading.title.replace(/\[[^\]]*\]/g, '')}</h2>
        <ReadingTeach reading={unit.reading} />
        <Footer>{nextBtn('Answer questions', onDone)}</Footer>
      </>
    )
  }
  if (lesson.kind === 'listening') {
    return (
      <>
        <h2 className="font-title text-2xl">{unit.listening.title}</h2>
        <ListeningTeach listening={unit.listening} />
        <Footer>{nextBtn('Answer questions', onDone)}</Footer>
      </>
    )
  }
  if (lesson.kind === 'travel') {
    return (
      <>
        <TravelTeach unit={unit} />
        <Footer>{nextBtn('Answer questions', onDone)}</Footer>
      </>
    )
  }

  const item = items[index]
  const last = index === items.length - 1
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="eyebrow text-ink/45">New {item.type === 'kana' ? 'character' : item.type === 'kanji' ? 'kanji' : 'word'}</p>
        <div className="flex gap-1.5">
          {items.map((it, i) => (
            <span key={it.id} className={`h-2 rounded-full border-2 border-outline transition-all ${i === index ? 'w-6 bg-torii' : i < index ? 'w-2 bg-torii/50' : 'w-2 bg-surface'}`} />
          ))}
        </div>
      </div>
      <TeachCard key={item.id} item={item} />
      <Footer>
        {index > 0 && (
          <button type="button" onClick={() => setIndex(index - 1)} aria-label="Previous" className="btn-ghost w-16 py-4">
            <ChevronLeft size={22} strokeWidth={3} />
          </button>
        )}
        {nextBtn(last ? 'Start practice' : 'Next', last ? onDone : () => setIndex(index + 1))}
      </Footer>
    </>
  )
}

function CheckpointIntro({ unit, count, onStart }) {
  const stop = stopFor(unit)
  return (
    <div className="relative flex flex-col items-center text-center pt-8 gap-3">
      <div className="absolute inset-x-0 top-0 h-72 speedlines animate-spin-slow" aria-hidden />
      <div className="relative">
        <SfxBurst text="ボス戦！" color="torii" size={180} />
      </div>
      <Mascot pose="idle" size={110} className="relative" />
      <h2 className="font-title text-3xl mt-2 relative">
        {stop.place} checkpoint
      </h2>
      <p className="text-ink/65 font-bold max-w-sm relative">
        {count} questions mixing everything from this {unit.kana ? 'prologue' : 'episode'}. Score {PASS_PERCENT}% to earn the {stop.place} stamp and unlock the next stop. No retries on a question. It&apos;s a real test!
      </p>
      <Footer>
        <button type="button" onClick={onStart} className="btn-primary flex-1 py-4 text-base">
          Start the boss battle
        </button>
      </Footer>
    </div>
  )
}

function ResultPhase({ lesson, unit, result, onRetry }) {
  const nextId = nextLessonId(lesson.id)
  const pct = Math.round(result.score * 100)
  const isCheckpoint = lesson.kind === 'checkpoint'
  const stop = stopFor(unit)
  const headline = !result.passed ? 'おしい！' : pct === 100 ? '完璧！' : pct >= 80 ? 'すごい！' : 'よし！'

  return (
    <div className="relative flex flex-col items-center text-center pt-6 gap-2">
      <div className="absolute inset-x-0 -top-6 h-80 speedlines animate-spin-slow" aria-hidden />
      {result.passed && pct >= 80 && <Confetti count={40} />}
      <div className="relative">
        <Sparkles count={result.passed ? 7 : 0} />
        <SfxBurst text={headline} color={result.passed ? 'sun' : 'sky'} size={200} />
      </div>
      <Mascot pose={result.passed ? 'celebrate' : 'oops'} size={120} className="relative -mt-2" />
      <h2 className="font-title text-2xl mt-2 relative">
        {isCheckpoint ? (result.passed ? `${stop.place} cleared!` : 'So close!') : pct === 100 ? 'Perfect lesson!' : 'Lesson complete!'}
      </h2>

      <div className="relative grid grid-cols-3 gap-3 w-full mt-4">
        <StatTile icon={Zap} label="XP" value={`+${result.xp}`} color="text-sun-deep" bg="bg-sun" />
        <StatTile icon={Target} label="Accuracy" value={`${pct}%`} color={result.passed ? 'text-matcha-deep' : 'text-torii-deep'} bg={result.passed ? 'bg-matcha' : 'bg-torii'} />
        <StatTile icon={Flame} label="Best combo" value={result.combo} color="text-torii" bg="bg-torii" />
      </div>

      {isCheckpoint && result.passed && (
        <MascotSays pose="celebrate" size={52} className="relative mt-4">
          You earned the {stop.place} stamp! 🔴 Check your stamp book.
        </MascotSays>
      )}
      {isCheckpoint && !result.passed && (
        <p className="relative text-sm font-bold text-ink/60 max-w-sm mt-3">You need {PASS_PERCENT}% to move on. Replay a few lessons, then try again. You&apos;ve got this!</p>
      )}
      {!isCheckpoint && lesson.items.length > 0 && (
        <p className="relative text-sm font-bold text-ink/55 max-w-sm mt-3">New items are in your Review queue, timed to come back right before you&apos;d forget them.</p>
      )}
      {lesson.kind === 'listening' && (
        <div className="relative w-full text-left mt-6">
          <p className="eyebrow text-ink/45 mb-2">Transcript</p>
          <ListeningTeach listening={unit.listening} showTranscript compact />
        </div>
      )}
      {lesson.kind === 'reading' && <p className="relative w-full text-left mt-6 text-[15px] font-bold text-ink/70 leading-relaxed panel p-4">{unit.reading.en}</p>}
      {lesson.kind === 'travel' && <p className="relative w-full text-left mt-6 text-[15px] font-bold text-ink/70 leading-relaxed panel p-4">{unit.place.reading.en}</p>}

      <Footer>
        <div className="flex-1 flex flex-col sm:flex-row-reverse gap-3">
          {result.passed && nextId ? (
            <Link to={`/lesson/${nextId}`} replace className="btn-primary flex-1 py-4 text-base">
              Next lesson
            </Link>
          ) : (
            <button type="button" onClick={onRetry} className="btn-primary flex-1 py-4 text-base">
              Try again
            </button>
          )}
          <Link to="/" className="btn-ghost flex-1 py-3.5">
            Back to map
          </Link>
        </div>
      </Footer>
    </div>
  )
}

function StatTile({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="rounded-2xl border-[2.5px] border-outline overflow-hidden bg-surface" style={{ boxShadow: '0 4px 0 0 rgb(var(--outline))' }}>
      <p className={`${bg} text-white text-[11px] font-extrabold uppercase tracking-wider py-1`}>{label}</p>
      <p className={`flex items-center justify-center gap-1 py-3 font-title text-xl ${color}`}>
        <Icon size={18} strokeWidth={2.8} />
        {value}
      </p>
    </div>
  )
}
