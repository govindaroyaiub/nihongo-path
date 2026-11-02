import { useEffect, useState } from 'react'
import { RotateCcw, Turtle } from 'lucide-react'

// Stroke-order animation from KanjiVG data (public/strokes, see
// scripts/fetch-strokes.mjs). Each stroke draws itself in order, over a faint
// guide of the whole character, with numbered start points.
const cache = new Map()

function strokeFile(ch) {
  return ch.codePointAt(0).toString(16).padStart(5, '0')
}

function loadStrokes(ch) {
  if (!cache.has(ch)) {
    cache.set(
      ch,
      fetch(`/strokes/${strokeFile(ch)}.json`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
    )
  }
  return cache.get(ch)
}

function Glyph({ ch, size, run, slow, numbers }) {
  const [data, setData] = useState(null)
  useEffect(() => {
    let live = true
    loadStrokes(ch).then((d) => live && setData(d))
    return () => {
      live = false
    }
  }, [ch])

  if (!data) return <div style={{ width: size, height: size }} className="rounded-xl bg-sunken animate-pulse" />

  const per = slow ? 1.1 : 0.55 // seconds per stroke
  return (
    <svg viewBox="0 0 109 109" width={size} height={size} aria-hidden="true" key={run}>
      {/* workbook guide lines */}
      <path d="M54.5 4v101M4 54.5h101" stroke="rgb(var(--line))" strokeWidth="1" strokeDasharray="3 3" />
      {/* faint whole-character guide */}
      {data.strokes.map((d, i) => (
        <path key={`g${i}`} d={d} fill="none" stroke="rgb(var(--ink) / 0.1)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {/* strokes drawing themselves, in order */}
      {data.strokes.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength="1"
          fill="none"
          stroke="rgb(var(--ink))"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          style={{ animation: `stroke-draw ${per}s ease-in-out ${i * (per + 0.15)}s forwards` }}
        />
      ))}
      {numbers &&
        data.numbers.map(([x, y], i) => (
          <text key={`n${i}`} x={x} y={y} fontSize="8" fontWeight="700" fill="rgb(var(--sky-deep))" fontFamily="sans-serif">
            {i + 1}
          </text>
        ))}
    </svg>
  )
}

// `text` may be several characters (きゃ): each draws in turn, side by side.
export default function StrokeOrder({ text, size = 112, numbers = true, label = 'How to write' }) {
  const [run, setRun] = useState(0)
  const [slow, setSlow] = useState(false)
  const chars = [...text]

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border-[2.5px] border-outline bg-surface px-3 pt-3 pb-2">
      <div className="flex items-end gap-1">
        {chars.map((ch, i) => (
          <Glyph key={`${ch}${i}`} ch={ch} size={/[ゃゅょャュョっッぁぃぅぇぉァィゥェォ]/.test(ch) ? size * 0.7 : size} run={run} slow={slow} numbers={numbers} />
        ))}
      </div>
      <span className="eyebrow text-ink/50 text-[10px]">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setRun((r) => r + 1)} aria-label="Replay stroke order" className="w-7 h-7 rounded-full border-2 border-outline bg-sunken flex items-center justify-center">
          <RotateCcw size={13} strokeWidth={2.8} />
        </button>
        <button
          type="button"
          onClick={() => {
            setSlow((s) => !s)
            setRun((r) => r + 1)
          }}
          aria-label="Toggle slow stroke order"
          className={`w-7 h-7 rounded-full border-2 border-outline flex items-center justify-center ${slow ? 'bg-sky text-white' : 'bg-sunken'}`}
        >
          <Turtle size={13} strokeWidth={2.8} />
        </button>
      </div>
    </div>
  )
}
