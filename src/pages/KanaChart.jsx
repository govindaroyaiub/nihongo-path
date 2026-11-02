import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { X } from 'lucide-react'
import StrokeOrder from '../components/StrokeOrder'
import { KANA_UNITS } from '../content/kana'
import { speak } from '../lib/speech'
import PageHeader from '../components/PageHeader'

// The gojūon table: 5 columns (a i u e o), gaps where a sound doesn't exist.
const BASE_ROWS = [
  ['a', 'i', 'u', 'e', 'o'],
  ['ka', 'ki', 'ku', 'ke', 'ko'],
  ['sa', 'shi', 'su', 'se', 'so'],
  ['ta', 'chi', 'tsu', 'te', 'to'],
  ['na', 'ni', 'nu', 'ne', 'no'],
  ['ha', 'hi', 'fu', 'he', 'ho'],
  ['ma', 'mi', 'mu', 'me', 'mo'],
  ['ya', null, 'yu', null, 'yo'],
  ['ra', 'ri', 'ru', 're', 'ro'],
  ['wa', null, null, null, 'wo'],
  ['n', null, null, null, null],
]

export default function KanaChart() {
  const { script } = useParams()
  const unit = KANA_UNITS.find((u) => u.id === `n5-${script}`)
  const [picked, setPicked] = useState(null)
  if (!unit) return <Navigate to="/practice" replace />
  const base = unit.items.filter((k) => k.group === 'base')
  const byRomaji = new Map(base.map((k) => [k.romaji, k]))
  const others = (group) => unit.items.filter((k) => k.group === group)
  const pick = (k) => {
    speak(k.char)
    setPicked(k)
  }

  return (
    <div className="flex-1 overflow-y-auto pb-10">
      <PageHeader back="/practice" eyebrow="Kana chart" title={unit.title} />
      <div className="px-4">
        <p className="text-sm font-bold text-ink/55 px-1 mb-4">Tap any character to hear it and see how it's written.</p>
        <div className="grid grid-cols-5 gap-2">
          {BASE_ROWS.flat().map((r, i) => (r && byRomaji.get(r) ? <Cell key={i} k={byRomaji.get(r)} onPick={pick} /> : <div key={i} />))}
        </div>
        <Group title="Voiced (dakuten ゛ / handakuten ゜)" items={[...others('dakuten'), ...others('handakuten')]} cols={5} onPick={pick} />
        <Group title="Combinations (yōon)" items={others('yoon')} cols={3} onPick={pick} />
      </div>
      {picked && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4" onClick={() => setPicked(null)}>
          <div className="panel p-5 w-full max-w-sm flex flex-col items-center gap-3 animate-pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex items-center justify-between">
              <span className="font-title text-2xl text-torii">{picked.romaji}</span>
              <button type="button" onClick={() => setPicked(null)} aria-label="Close" className="w-9 h-9 rounded-full bg-sunken flex items-center justify-center">
                <X size={18} strokeWidth={2.6} />
              </button>
            </div>
            <StrokeOrder key={picked.id} text={picked.char} size={picked.char.length > 1 ? 120 : 180} />
          </div>
        </div>
      )}
    </div>
  )
}

function Group({ title, items, cols, onPick }) {
  return (
    <>
      <h2 className="text-xs font-extrabold uppercase tracking-wider text-ink/40 mt-7 mb-3 px-1">{title}</h2>
      <div className={`grid gap-2 ${cols === 3 ? 'grid-cols-3' : 'grid-cols-5'}`}>
        {items.map((k) => (
          <Cell key={k.id} k={k} onPick={onPick} />
        ))}
      </div>
    </>
  )
}

function Cell({ k, onPick }) {
  return (
    <button
      type="button"
      onClick={() => onPick(k)}
      className="aspect-square rounded-xl bg-surface border-[2.5px] border-outline flex flex-col items-center justify-center active:scale-95 active:bg-accent-soft transition-all"
    >
      <span className="font-jp font-bold text-[24px] leading-none" lang="ja">
        {k.char}
      </span>
      <span className="text-[10px] text-ink/40 mt-1">{k.romaji}</span>
    </button>
  )
}
