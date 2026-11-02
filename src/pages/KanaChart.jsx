import { useParams, Navigate } from 'react-router-dom'
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
  if (!unit) return <Navigate to="/practice" replace />
  const base = unit.items.filter((k) => k.group === 'base')
  const byRomaji = new Map(base.map((k) => [k.romaji, k]))
  const others = (group) => unit.items.filter((k) => k.group === group)

  return (
    <div className="flex-1 overflow-y-auto pb-10">
      <PageHeader back="/practice" eyebrow="Kana chart" title={unit.title} />
      <div className="px-4">
        <p className="text-sm text-ink/50 px-1 mb-4">Tap any character to hear it.</p>
        <div className="grid grid-cols-5 gap-2">
          {BASE_ROWS.flat().map((r, i) => (r && byRomaji.get(r) ? <Cell key={i} k={byRomaji.get(r)} /> : <div key={i} />))}
        </div>
        <Group title="Voiced (dakuten ゛ / handakuten ゜)" items={[...others('dakuten'), ...others('handakuten')]} cols={5} />
        <Group title="Combinations (yōon)" items={others('yoon')} cols={3} />
      </div>
    </div>
  )
}

function Group({ title, items, cols }) {
  return (
    <>
      <h2 className="text-xs font-extrabold uppercase tracking-wider text-ink/40 mt-7 mb-3 px-1">{title}</h2>
      <div className={`grid gap-2 ${cols === 3 ? 'grid-cols-3' : 'grid-cols-5'}`}>
        {items.map((k) => (
          <Cell key={k.id} k={k} />
        ))}
      </div>
    </>
  )
}

function Cell({ k }) {
  return (
    <button
      type="button"
      onClick={() => speak(k.char)}
      className="aspect-square rounded-xl bg-surface border-[2.5px] border-outline flex flex-col items-center justify-center active:scale-95 active:bg-accent-soft transition-all"
    >
      <span className="font-jp font-bold text-[24px] leading-none" lang="ja">
        {k.char}
      </span>
      <span className="text-[10px] text-ink/40 mt-1">{k.romaji}</span>
    </button>
  )
}
