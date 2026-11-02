import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Check, Lock, ChevronRight } from 'lucide-react'
import { useStore } from '../lib/store'
import { getUnit } from '../lib/curriculum'
import { lessonStatus, unitProgress } from '../lib/progress'
import { LESSON_KINDS } from '../lib/lessonKinds'
import { stopFor, COLOR } from '../lib/journey'
import { speechText } from '../lib/furigana'
import PageHeader from '../components/PageHeader'
import ProgressBar from '../components/ProgressBar'
import JpText from '../components/JpText'
import SpeakButton from '../components/SpeakButton'
import { PlaceArt } from '../components/Places'

// Episode guide: the unit's lessons plus a cheat-sheet of everything in it.
export default function Unit() {
  const { unitId } = useParams()
  const unit = getUnit(unitId)
  const lessons = useStore((s) => s.lessons)
  const [tab, setTab] = useState('lessons')
  if (!unit) return <Navigate to="/" replace />
  const p = unitProgress(unit.id, lessons)
  const stop = stopFor(unit)
  const c = COLOR[stop.color]
  const tabs = [
    ['lessons', 'Lessons'],
    ...(unit.vocab?.length ? [['words', 'Words']] : []),
    ...(unit.grammar?.length ? [['grammar', 'Grammar']] : []),
    ...(unit.kanji?.length ? [['kanji', 'Kanji']] : []),
    ...(unit.kana ? [['kana', 'Characters']] : []),
  ]

  return (
    <div className="pb-10">
      <PageHeader back="/" eyebrow={unit.kana ? 'Prologue' : `Episode ${unit.number} · 第${unit.number}話`} title={unit.title} />

      {unit.place && (
        <Link to={`/place/${unit.id}`} className="block mb-5 active:translate-y-0.5 transition-transform">
          <PlaceArt place={unit.place} unit={unit} height={140} />
        </Link>
      )}

      <p className={`font-title text-lg ${c.text}`}>
        {stop.emoji} {stop.place}
      </p>
      <p className="font-bold text-ink/70 text-[15px] leading-relaxed mt-1">{unit.goal}</p>
      {unit.note && <p className="mt-3 text-sm font-medium text-ink/70 leading-relaxed panel p-4">{unit.note}</p>}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 rounded-full border-[2.5px] border-outline">
          <ProgressBar value={p.done} max={p.total} color={c.bg} height="h-3" />
        </div>
        <span className="text-xs font-extrabold text-ink/50 tabular-nums">
          {p.done}/{p.total}
        </span>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`shrink-0 px-4 py-2 rounded-xl border-[2.5px] border-outline font-extrabold text-sm ${tab === id ? `${c.bg} text-white` : 'bg-surface text-ink/60'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === 'lessons' && <LessonList unit={unit} lessons={lessons} />}
        {tab === 'words' && (
          <div className="panel divide-y-2 divide-line">
            {unit.vocab.map((v) => (
              <div key={v.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <JpText text={v.word} furigana className="text-xl font-bold" />
                  <p className="text-sm font-bold text-ink/55 truncate">{v.meaning}</p>
                </div>
                <SpeakButton text={speechText(v.word)} size="sm" />
              </div>
            ))}
          </div>
        )}
        {tab === 'grammar' && (
          <div className="flex flex-col gap-3">
            {unit.grammar.map((g) => (
              <Link key={g.id} to={`/grammar/${g.id}`} className="tile p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <JpText text={g.pattern} className="font-extrabold text-lg block" />
                  <p className="text-sm font-bold text-ink/55">{g.meaning}</p>
                </div>
                <ChevronRight size={20} className="text-ink/30" />
              </Link>
            ))}
          </div>
        )}
        {tab === 'kanji' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {unit.kanji.map((k) => (
              <div key={k.id} className="panel !rounded-2xl p-3 text-center">
                <span className="font-jp font-bold text-5xl block" lang="ja">
                  {k.char}
                </span>
                <p className="font-extrabold text-sm mt-1 truncate">{k.meanings.slice(0, 2).join(', ')}</p>
                <p className="text-xs font-bold text-ink/50 font-jp truncate">{[...k.on, ...k.kun].slice(0, 3).join('・')}</p>
              </div>
            ))}
          </div>
        )}
        {tab === 'kana' && (
          <div className="grid grid-cols-5 gap-2">
            {unit.items.map((k) => (
              <div key={k.id} className="panel !rounded-xl aspect-square flex flex-col items-center justify-center !shadow-none">
                <span className="font-jp font-bold text-2xl leading-none">{k.char}</span>
                <span className="text-[10px] font-bold text-ink/50">{k.romaji}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function LessonList({ unit, lessons }) {
  return (
    <ol className="flex flex-col gap-3">
      {unit.lessons.map((lesson) => {
        const status = lessonStatus(lesson.id, lessons)
        const kind = LESSON_KINDS[lesson.kind]
        const k = COLOR[kind.color]
        const Icon = kind.icon
        const best = lessons[lesson.id]?.best
        const body = (
          <div className={`tile p-3 flex items-center gap-3 ${status === 'locked' ? 'opacity-50' : ''}`}>
            <div className={`w-12 h-12 rounded-full border-[2.5px] border-outline flex items-center justify-center shrink-0 ${status === 'locked' ? 'bg-sunken text-ink/30' : `${k.bg} text-white`}`}>
              {status === 'done' ? <Check size={22} strokeWidth={3.2} /> : status === 'locked' ? <Lock size={18} strokeWidth={2.6} /> : <Icon size={22} strokeWidth={2.6} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`eyebrow ${status === 'locked' ? 'text-ink/40' : k.text}`}>{kind.label}</p>
              <p className="font-extrabold truncate font-jp">{lesson.title.replace(/\[[^\]]*\]/g, '')}</p>
            </div>
            {status === 'open' && <span className="btn-primary text-xs px-3 py-1.5">Start</span>}
            {status === 'done' && <span className="text-sm font-extrabold text-ink/50 tabular-nums">{Math.round((best ?? 0) * 100)}%</span>}
          </div>
        )
        return <li key={lesson.id}>{status === 'locked' ? body : <Link to={`/lesson/${lesson.id}`}>{body}</Link>}</li>
      })}
    </ol>
  )
}
