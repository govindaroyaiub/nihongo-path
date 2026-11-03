import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Lock, BookOpenText, Star, Repeat } from 'lucide-react'
import { useStore, lessonXp } from '../lib/store'
import { LEVELS, unitsForLevel } from '../lib/curriculum'
import { currentLesson, lessonStatus, unitProgress, levelProgress, dueItemIds } from '../lib/progress'
import { LESSON_KINDS } from '../lib/lessonKinds'
import { stopFor, COLOR } from '../lib/journey'
import { StatPills } from '../components/Stats'
import { Sakura, Cloud } from '../components/Anime'
import ProgressBar from '../components/ProgressBar'
import { UnitGoal } from '../components/Payoff'
import { readableCount } from '../lib/readable'
import Mascot from '../components/Mascot'

// Horizontal offsets (in node widths) that make the path wind like a trail.
const WIND = [0, 0.7, 1.1, 0.7, 0, -0.7, -1.1, -0.7]
const NODE_SHIFT = 64

export default function Learn() {
  const lessons = useStore((s) => s.lessons)
  const srs = useStore((s) => s.srs)
  const due = dueItemIds(srs).length
  const next = currentLesson(lessons)
  const [level, setLevel] = useState(next?.level ?? 'N5')
  const [open, setOpen] = useState(null) // lesson id whose popover is showing
  const units = unitsForLevel(level)
  const lp = levelProgress(level, lessons)
  const currentRef = useRef(null)
  const headerRef = useRef(null)
  const sectionRefs = useRef([])
  // Episode whose title card has scrolled up under the top bar, if any.
  const [pinned, setPinned] = useState(null)

  useEffect(() => {
    // Bring the current lesson into view on arrival (unless it's right at the top).
    if (lp.done > 0) currentRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const barBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0
      // Last episode that has started above the bar; pinned once its title card is hidden.
      let index = -1
      sectionRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < barBottom) index = i
      })
      const card = sectionRefs.current[index]?.firstElementChild
      setPinned(card && card.getBoundingClientRect().bottom < barBottom ? index : null)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [level])

  const pinnedUnit = pinned === null ? null : units[pinned]
  const jumpToPinned = (e) => {
    e.stopPropagation()
    sectionRefs.current[pinned]?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  return (
    <div onClick={() => setOpen(null)} className="relative">
      <Sakura count={10} />

      {/* Top bar: level switch + stats (stats move to the side rail on wide screens). */}
      <header ref={headerRef} className="sticky top-0 z-30 pt-[max(env(safe-area-inset-top),0.75rem)] pb-2">
        {/* Floating rounded bar, outlined like every other panel. */}
        <div className="flex items-center justify-between gap-3 rounded-full bg-surface/95 backdrop-blur-md border-[2.5px] border-outline pl-1.5 pr-3 py-1.5" style={{ boxShadow: '0 4px 0 0 rgb(var(--outline))' }}>
          <div className="flex items-center gap-1 p-1 rounded-full bg-sunken">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setLevel(l.id)
                }}
                className={`px-4 py-1 rounded-full text-sm font-title transition-all ${level === l.id ? 'bg-torii text-white ring-2 ring-outline' : 'text-ink/40 hover:text-ink/70'}`}
              >
                {l.title}
              </button>
            ))}
          </div>
          {/* Wide screens only: on phones the bar is already full. */}
          <StopChip unit={pinnedUnit} index={pinned} onClick={jumpToPinned} className="hidden sm:flex flex-1 min-w-0 justify-end" />
          <div className="xl:hidden">
            <StatPills />
          </div>
        </div>
      </header>

      {units.length > 0 ? (
        <>
          <Hero level={level} done={lp.done} total={lp.total} readable={readableCount(lessons, srs)} />
          {units.map((unit, i) => (
            <UnitSection
              key={unit.id}
              ref={(el) => (sectionRefs.current[i] = el)}
              unit={unit}
              index={i}
              lessons={lessons}
              next={next}
              due={due}
              open={open}
              setOpen={setOpen}
              currentRef={currentRef}
            />
          ))}
          <FinishLine level={level} />
        </>
      ) : (
        <div className="mt-16 text-center px-6 flex flex-col items-center relative">
          <Mascot pose="think" size={120} />
          <p className="mt-4 font-title text-2xl">Season 2 · N4</p>
          <p className="mt-2 text-ink/60 font-bold max-w-sm">Finish the N5 season first. Every N4 episode builds on what you learn there.</p>
          <button type="button" onClick={() => setLevel('N5')} className="btn-primary px-6 py-3 mt-6">
            Back to N5
          </button>
        </div>
      )}
    </div>
  )
}

const outlinedTitle = { WebkitTextStroke: '1.5px rgb(var(--outline))', paintOrder: 'stroke fill', textShadow: '2px 2px 0 rgb(var(--outline))' }

// Anime-sky banner: Kitsu, clouds, and how far along the season you are.
function Hero({ level, done, total, readable }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  return (
    <div className="relative mt-4 rounded-3xl border-[2.5px] border-outline overflow-hidden" style={{ boxShadow: '5px 5px 0 0 rgb(var(--outline))' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #4f9dff 0%, #8ccfff 55%, #ffd3e6 100%)' }} />
      <Cloud className="absolute w-28 -left-5 top-2" />
      <Cloud className="absolute w-16 right-24 top-3" />
      <Cloud className="absolute w-24 -right-8 bottom-10" />
      <div className="relative flex items-end gap-2 px-5 pt-5 pb-4">
        <div className="flex-1 min-w-0 pb-1">
          <p className="font-title text-white text-xs tracking-widest" style={outlinedTitle}>
            SEASON 1 · JLPT {level}
          </p>
          <p className="font-title text-[26px] sm:text-3xl text-white leading-tight mt-1" style={outlinedTitle}>
            {done === 0 ? 'Journey across Japan' : done === total ? 'Season complete!' : `${pct}% to ${level}`}
          </p>
          <div className="mt-3 rounded-full border-[2.5px] border-outline bg-white">
            <ProgressBar value={done} max={total} color="bg-torii" height="h-3" />
          </div>
          <p className="text-xs font-extrabold text-[#261e3e]/70 mt-1.5">
            {done}/{total} lessons cleared
            {readable > 0 && <> · 📖 {readable} words you can read</>}
          </p>
        </div>
        <Mascot pose="wave" size={96} />
      </div>
    </div>
  )
}

function episodeLabels(unit, index) {
  return unit.kana
    ? { episode: `序章${index + 1}`, label: `Prologue ${index + 1}` }
    : { episode: `第${unit.number}話`, label: `Episode ${unit.number}` }
}

// Compact reminder of the episode you're scrolling through, shown once its
// title card is hidden under the top bar. Tapping it scrolls back to the card.
// Keeps showing the last stop while fading out, so the text never blanks mid-fade.
function StopChip({ unit, index, onClick, className = '' }) {
  const last = useRef(null)
  if (unit) last.current = { unit, index }
  const shown = last.current
  const visible = Boolean(unit)
  if (!shown) return null
  const stop = stopFor(shown.unit)
  const { episode, label } = episodeLabels(shown.unit, shown.index)

  return (
    <div className={`${className} transition-all duration-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`} aria-hidden={!visible}>
      <button
        type="button"
        onClick={onClick}
        tabIndex={visible ? 0 : -1}
        title={`Back to ${label}: ${stop.place}`}
        className="flex items-center gap-2 min-w-0 max-w-full text-left rounded-2xl px-2 py-1 hover:bg-sunken"
      >
        <span className="shrink-0 font-title text-[11px] bg-[#261e3e] text-white px-1.5 py-0.5 rounded-md -rotate-2">{episode}</span>
        <span className="min-w-0 leading-tight text-right">
          <span className="block eyebrow text-[10px] text-ink/50">{label}</span>
          <span className="block font-title text-sm truncate">
            {stop.emoji} {stop.place}
          </span>
        </span>
      </button>
    </div>
  )
}

function UnitSection({ ref, unit, index, lessons, next, due, open, setOpen, currentRef }) {
  const stop = stopFor(unit)
  const c = COLOR[stop.color]
  const p = unitProgress(unit.id, lessons)
  const { episode, label } = episodeLabels(unit, index)

  return (
    <section ref={ref} className="mt-10 relative scroll-mt-24">
      {/* Episode title card */}
      {/* Light card colors (sun) get dark ink text so it stays readable. */}
      <div className={`relative overflow-hidden rounded-3xl ${c.bg} ${stop.color === 'sun' ? 'text-[#261e3e]' : 'text-white'} border-[2.5px] border-outline`} style={{ boxShadow: '5px 5px 0 0 rgb(var(--outline))' }}>
        <div className="absolute inset-0 halftone" />
        <div className="absolute -right-3 -top-5 font-title text-[110px] leading-none text-white/20 select-none" aria-hidden>
          {stop.jp.slice(0, 1)}
        </div>
        <div className="relative px-5 py-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-title text-[13px] bg-[#261e3e] text-white px-2 py-0.5 rounded-lg -rotate-2">{episode}</span>
              <span className="eyebrow opacity-90">{label}</span>
            </div>
            <p className={`font-title text-[22px] sm:text-2xl leading-tight mt-2 ${stop.color === 'sun' ? 'text-white' : ''}`} style={outlinedTitle}>
              {stop.emoji} {stop.place}
            </p>
            <p className="font-extrabold text-[15px] leading-snug mt-1">{unit.title}</p>
            <p className="text-sm opacity-90 font-bold mt-0.5 line-clamp-2">{unit.goal}</p>
            <UnitGoal unit={unit} className="mt-1.5 opacity-95" />
          </div>
          <Link
            to={`/unit/${unit.id}`}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 flex flex-col items-center gap-0.5 rounded-2xl bg-white text-[#261e3e] border-[2.5px] border-outline px-3 py-2 text-[11px] font-extrabold uppercase active:translate-y-0.5"
            style={{ boxShadow: '0 3px 0 0 rgb(var(--outline))' }}
          >
            <BookOpenText size={20} strokeWidth={2.6} />
            Guide
          </Link>
        </div>
        <div className="relative h-2.5 bg-black/20 border-t-[2.5px] border-outline">
          <div className="h-full bg-sun" style={{ width: `${(p.done / p.total) * 100}%` }} />
        </div>
      </div>

      <ol className="relative flex flex-col items-center gap-6 py-8">
        {unit.lessons.map((lesson, i) => {
          const status = lessonStatus(lesson.id, lessons)
          const isCurrent = next?.id === lesson.id
          const offset = WIND[i % WIND.length]
          const node = (
            // Each <li> is its own stacking context (because of the transform), so the
            // one with an open popover must sit above the nodes that follow it.
            <li
              key={lesson.id}
              ref={isCurrent ? currentRef : null}
              className="relative"
              style={{ transform: `translateX(${offset * NODE_SHIFT}px)`, zIndex: open === lesson.id ? 25 : undefined }}
            >
              <LessonNode
                lesson={lesson}
                status={status}
                isCurrent={isCurrent}
                color={stop.color}
                shift={offset * NODE_SHIFT}
                open={open === lesson.id}
                onToggle={() => setOpen(open === lesson.id ? null : lesson.id)}
              />
              {isCurrent && (
                <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block ${offset > 0 ? 'right-full mr-8' : 'left-full ml-8'}`}>
                  <Mascot pose="idle" size={80} />
                </div>
              )}
            </li>
          )
          // Reviews piling up → a review stop on the path, just before the next lesson.
          return isCurrent && due >= REVIEW_NUDGE ? [<ReviewStop key="review" due={due} />, node] : node
        })}
      </ol>
    </section>
  )
}

const REVIEW_NUDGE = 10

function ReviewStop({ due }) {
  return (
    // Extra room below for the next node's START! bubble.
    <li className="relative mb-10">
      <Link
        to="/review"
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-3 rounded-2xl bg-sky text-white border-[2.5px] border-outline pl-2 pr-4 py-2 active:translate-y-0.5"
        style={{ boxShadow: '0 4px 0 0 rgb(var(--outline))' }}
      >
        <span className="w-10 h-10 rounded-full bg-white text-sky border-[2.5px] border-outline flex items-center justify-center">
          <Repeat size={20} strokeWidth={2.8} />
        </span>
        <span className="text-left">
          <span className="block font-title text-sm leading-tight">Review time!</span>
          <span className="block text-xs font-extrabold opacity-90">{due} items due · keep them fresh</span>
        </span>
      </Link>
    </li>
  )
}

function LessonNode({ lesson, status, isCurrent, color, shift, open, onToggle }) {
  const navigate = useNavigate()
  const kind = LESSON_KINDS[lesson.kind]
  const Icon = kind.icon
  const c = COLOR[color]
  const big = lesson.kind === 'checkpoint'
  const size = big ? 'w-[92px] h-[92px]' : 'w-[70px] h-[70px]'
  const locked = status === 'locked'
  const best = useStore((s) => s.lessons[lesson.id]?.best)

  return (
    <div className="relative flex flex-col items-center">
      {isCurrent && !open && (
        <div className="absolute -top-12 z-10 animate-bob">
          <div className="relative px-3 py-1 rounded-xl bg-surface border-[2.5px] border-outline font-title text-sm text-torii whitespace-nowrap">
            START!
            <span className="absolute left-1/2 -bottom-[8px] -translate-x-1/2 w-3 h-3 rotate-45 bg-surface border-r-[2.5px] border-b-[2.5px] border-outline" />
          </div>
        </div>
      )}
      <button
        type="button"
        aria-label={`${kind.label}: ${lesson.title}${locked ? ' (locked)' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        className={`${size} rounded-full flex items-center justify-center border-[3px] border-outline transition-transform duration-100 active:translate-y-1.5 ${
          locked ? 'bg-sunken text-ink/30' : `${c.bg} text-white`
        } ${isCurrent ? 'animate-pulse-ring' : ''}`}
        style={{ boxShadow: '0 6px 0 0 rgb(var(--outline))' }}
      >
        {status === 'done' ? (
          big ? <Star size={40} strokeWidth={2.6} className="fill-current" /> : <Check size={34} strokeWidth={3.5} />
        ) : locked ? (
          <Lock size={big ? 32 : 24} strokeWidth={2.6} />
        ) : (
          <Icon size={big ? 40 : 30} strokeWidth={2.6} />
        )}
      </button>
      {status === 'done' && best === 1 && (
        <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-sun text-white border-[2.5px] border-outline flex items-center justify-center" title="Perfect score">
          <Star size={13} strokeWidth={3} className="fill-current" />
        </span>
      )}

      {/* Popover re-centres on the path (undoing the wind offset) so it never runs off a phone screen. */}
      {open && (
        <div onClick={(e) => e.stopPropagation()} className="absolute top-full mt-4 z-20 w-72 panel p-4 animate-pop-in" style={{ left: '50%', marginLeft: -144 - shift }}>
          <span
            className="absolute -top-[10px] w-4 h-4 rotate-45 bg-surface border-l-[2.5px] border-t-[2.5px] border-outline"
            style={{ left: `calc(50% + ${shift}px - 8px)` }}
          />
          <p className={`eyebrow ${locked ? 'text-ink/40' : c.text}`}>{kind.label}</p>
          <p className="font-extrabold text-lg leading-snug mt-0.5 font-jp">{lesson.title}</p>
          {locked ? (
            <p className="text-sm text-ink/60 font-bold mt-2">Clear the lessons before this one to unlock it.</p>
          ) : (
            <>
              <p className="text-sm text-ink/60 font-bold mt-1">
                {status === 'done'
                  ? `Best: ${Math.round((best ?? 0) * 100)}%. Practice again anytime.`
                  : lesson.kind === 'checkpoint'
                    ? 'Boss battle! Score 80% to reach the next stop.'
                    : lessonBlurb(lesson)}
              </p>
              <button type="button" onClick={() => navigate(`/lesson/${lesson.id}`)} className={`btn-3d ${c.bg} text-white w-full py-3 mt-3 text-sm`}>
                {status === 'done' ? 'Practice again' : `Start · +${lessonXp(lesson.kind, 0)} XP`}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function lessonBlurb(lesson) {
  const n = lesson.items.length
  switch (lesson.kind) {
    case 'kana':
      return `Learn ${n} new characters.`
    case 'vocab':
      return `Learn ${n} new words.`
    case 'kanji':
      return `Learn ${n} new kanji.`
    case 'grammar':
      return 'A new sentence pattern, then practice.'
    case 'reading':
      return 'Read a short story and answer questions.'
    case 'listening':
      return 'Listen to a conversation and answer questions.'
    case 'travel':
      return 'Explore this place and read about it in Japanese.'
    default:
      return ''
  }
}

function FinishLine({ level }) {
  return (
    <div className="mt-4 mb-10 flex flex-col items-center text-center relative">
      <div className="text-6xl">🗻</div>
      <p className="font-title text-xl mt-2">Final boss · JLPT {level}</p>
      <p className="text-sm text-ink/55 font-bold max-w-xs mt-1">Mock exams in the real format wait at the summit.</p>
      <Link to="/practice#exam" className="btn-ghost px-5 py-2.5 mt-4 text-sm">
        Exam prep
      </Link>
    </div>
  )
}
