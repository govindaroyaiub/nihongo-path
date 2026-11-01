import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ChevronRight, Search } from 'lucide-react'
import { useStore } from '../lib/store'
import { allItems, getUnit } from '../lib/curriculum'
import { speechText, toKana, toPlain } from '../lib/furigana'
import JpText from '../components/JpText'
import SpeakButton from '../components/SpeakButton'
import PageHeader from '../components/PageHeader'

const TITLES = { vocab: 'Words', kanji: 'Kanji', grammar: 'Grammar' }

export default function Library() {
  const { type } = useParams()
  const srs = useStore((s) => s.srs)
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  if (!TITLES[type]) return <Navigate to="/practice" replace />

  const q = query.trim().toLowerCase()
  const items = allItems()
    .filter((i) => i.type === type && (showAll || srs[i.id]))
    .filter((i) => !q || searchText(i).includes(q))

  return (
    <div className="flex-1 overflow-y-auto pb-10">
      <PageHeader back="/practice" eyebrow="Library" title={TITLES[type]} />
      <div className="px-5">
        <div className="flex items-center gap-2 rounded-2xl bg-card border border-ink/10 px-3.5">
          <Search size={17} className="text-ink/35" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search English or Japanese" className="flex-1 py-3 bg-transparent outline-none text-[15px]" />
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm text-ink/55">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} className="accent-accent w-4 h-4" />
          Include items I haven't learned yet
        </label>

        {items.length === 0 ? (
          <p className="text-center text-sm text-ink/45 py-16">{q ? 'No matches.' : 'Nothing learned here yet. Finish lessons to fill your library.'}</p>
        ) : (
          <ul className="mt-4 panel !rounded-2xl divide-y divide-line">
            {items.map((item) => (
              <li key={item.id}>
                {type === 'vocab' && <VocabRow item={item} />}
                {type === 'kanji' && <KanjiRow item={item} />}
                {type === 'grammar' && <GrammarRow item={item} />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function searchText(i) {
  if (i.type === 'vocab') return `${toPlain(i.word)} ${toKana(i.word)} ${i.meaning}`.toLowerCase()
  if (i.type === 'kanji') return `${i.char} ${i.meanings.join(' ')} ${i.on.join(' ')} ${i.kun.join(' ')}`.toLowerCase()
  return `${toPlain(i.title)} ${i.meaning} ${toPlain(i.pattern)}`.toLowerCase()
}

function unitLabel(item) {
  const unit = getUnit(item.unitId)
  return `${item.level} · ${unit.kana ? unit.title : `Unit ${unit.number}`}`
}

function VocabRow({ item }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-1 min-w-0">
        <JpText text={item.word} furigana className="text-xl" />
        <p className="text-sm text-ink/55 truncate">{item.meaning}</p>
      </div>
      <span className="text-[10px] text-ink/30 shrink-0">{unitLabel(item)}</span>
      <SpeakButton text={speechText(item.word)} size="sm" />
    </div>
  )
}

function KanjiRow({ item }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <span className="font-hand text-4xl w-12 text-center" lang="ja">
        {item.char}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-bold truncate">{item.meanings.join(', ')}</p>
        <p className="text-xs text-ink/45 font-jp truncate">
          {item.on.join('・')} {item.kun.length > 0 && `／ ${item.kun.join('・')}`}
        </p>
      </div>
      <span className="text-[10px] text-ink/30 shrink-0">{unitLabel(item)}</span>
    </div>
  )
}

function GrammarRow({ item }) {
  return (
    <Link to={`/grammar/${item.id}`} className="flex items-center gap-3 px-4 py-3.5 active:bg-ink/[0.02]">
      <div className="flex-1 min-w-0">
        <JpText text={item.title} className="font-bold font-sans" />
        <p className="text-xs text-ink/45 truncate">{unitLabel(item)}</p>
      </div>
      <ChevronRight size={18} className="text-ink/25" />
    </Link>
  )
}
