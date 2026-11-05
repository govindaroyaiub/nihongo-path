import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import StrokeOrder from '../components/StrokeOrder'
import { KANA_UNITS } from '../content/kana'
import { speak } from '../lib/speech'
import PageHeader from '../components/PageHeader'
import KanaHint from '../components/KanaHint'

// The kana as a grid: consonant down the side, vowel across the top, so every
// character sits where its sound is. Tables are written in hiragana; katakana
// is the same character shifted by 0x60 in Unicode (か → カ).
const VOWELS = ['a', 'i', 'u', 'e', 'o']

const BASIC = [
  ['—', 'あいうえお'],
  ['k', 'かきくけこ'],
  ['s', 'さしすせそ'],
  ['t', 'たちつてと'],
  ['n', 'なにぬねの'],
  ['h', 'はひふへほ'],
  ['m', 'まみむめも'],
  ['y', 'や_ゆ_よ'],
  ['r', 'らりるれろ'],
  ['w', 'わ___を'],
  ['n', 'ん____'],
]

const VOICED = [
  ['g', 'がぎぐげご'],
  ['z', 'ざじずぜぞ'],
  ['d', 'だぢづでど'],
  ['b', 'ばびぶべぼ'],
  ['p', 'ぱぴぷぺぽ'],
]

// i-column kana + small ゃ ゅ ょ.
const COMBO_BASES = [
  ['ky', 'き'],
  ['sh', 'し'],
  ['ch', 'ち'],
  ['ny', 'に'],
  ['hy', 'ひ'],
  ['my', 'み'],
  ['ry', 'り'],
  ['gy', 'ぎ'],
  ['j', 'じ'],
  ['by', 'び'],
  ['py', 'ぴ'],
]

const toKatakana = (s) => s.replace(/[ぁ-ゖ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60))

const ITEMS = new Map(KANA_UNITS.flatMap((u) => u.items).map((k) => [k.char, k]))
const ROMAJI = new Map([...ITEMS].map(([char, k]) => [char, k.romaji]))

const SCRIPTS = [
  ['hiragana', 'Hiragana', 'あ'],
  ['katakana', 'Katakana', 'ア'],
  ['both', 'Both', 'あア'],
]

export default function Chart() {
  const [params, setParams] = useSearchParams()
  const script = SCRIPTS.some(([id]) => id === params.get('script')) ? params.get('script') : 'hiragana'
  const [picked, setPicked] = useState(null)

  const pick = (hira) => {
    const char = script === 'katakana' ? toKatakana(hira) : hira
    speak(char)
    setPicked({ hira, char })
  }
  const cell = (hira) => (hira && hira !== '_' ? <Cell key={hira} hira={hira} script={script} onPick={pick} /> : null)

  return (
    <div className="pb-10">
      <PageHeader back="/" eyebrow="Kana chart · 五十音" title="Every sound, in a grid" />

      <div className="flex gap-2 mb-2">
        {SCRIPTS.map(([id, label, glyph]) => (
          <button
            key={id}
            type="button"
            onClick={() => setParams({ script: id }, { replace: true })}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border-[2.5px] border-outline font-extrabold text-sm ${script === id ? 'bg-torii text-white' : 'bg-surface text-ink/60'}`}
          >
            <span className="font-jp font-bold" lang="ja">
              {glyph}
            </span>
            {label}
          </button>
        ))}
      </div>
      <p className="text-sm font-bold text-ink/55 px-1 mb-6">Find the row (consonant) and the column (vowel): k + a = か ka. Tap any character to hear it and see how it's written.</p>

      <Table title="Basic sounds" note="Rows are consonants, columns are vowels. Japanese orders vowels a · i · u · e · o." cols={VOWELS}>
        {BASIC.map(([label, row]) => (
          <Row key={label + row} label={label}>
            {[...row].map((h, i) => cell(h) ?? <Empty key={i} />)}
          </Row>
        ))}
      </Table>

      <Table title="Voiced sounds ゛ ゜" note="Add ゛ (two dots) to make a sound voiced: k → g, s → z, t → d, h → b. Add ゜ (a circle) to h for p." cols={VOWELS}>
        {VOICED.map(([label, row]) => (
          <Row key={label} label={label}>
            {[...row].map((h, i) => cell(h) ?? <Empty key={i} />)}
          </Row>
        ))}
      </Table>

      <Table title="Combinations ゃ ゅ ょ" note="An i-column kana plus a small ゃ ゅ ょ, said as one beat: き ki + ゃ ya = きゃ kya." cols={['ya', 'yu', 'yo']}>
        {COMBO_BASES.map(([label, base]) => (
          <Row key={label} label={label}>
            {['ゃ', 'ゅ', 'ょ'].map((small) => cell(base + small))}
          </Row>
        ))}
      </Table>

      {picked && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4" onClick={() => setPicked(null)}>
          <div className={`panel p-5 w-full ${script === 'both' ? 'max-w-md' : 'max-w-sm'} max-h-[90vh] overflow-y-auto flex flex-col items-center gap-3 animate-pop-in`} onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex items-center justify-between">
              <span className="font-title text-2xl text-torii">{ROMAJI.get(picked.hira)}</span>
              <button type="button" onClick={() => setPicked(null)} aria-label="Close" className="w-9 h-9 rounded-full bg-sunken flex items-center justify-center">
                <X size={18} strokeWidth={2.6} />
              </button>
            </div>
            {script === 'both' ? (
              // Side by side, smaller, so both scripts fit without a long scroll.
              <div className="w-full grid grid-cols-2 gap-2 justify-items-center">
                <StrokeOrder key={picked.char} text={picked.char} size={picked.char.length > 1 ? 56 : 112} label="Hiragana" />
                <StrokeOrder key={`k${picked.char}`} text={toKatakana(picked.hira)} size={picked.hira.length > 1 ? 56 : 112} label="Katakana" />
              </div>
            ) : (
              <StrokeOrder key={picked.char} text={picked.char} size={picked.char.length > 1 ? 120 : 180} />
            )}
            <KanaHint item={ITEMS.get(picked.char)} className="w-full" />
            {script === 'both' && <KanaHint item={ITEMS.get(toKatakana(picked.hira))} className="w-full" />}
          </div>
        </div>
      )}
    </div>
  )
}

function Table({ title, note, cols, children }) {
  return (
    <section className="mb-8">
      <h2 className="font-title text-lg">{title}</h2>
      <p className="text-xs font-bold text-ink/50 mt-0.5 mb-3">{note}</p>
      <div className="panel p-2 sm:p-3">
        <div className="grid gap-1.5 sm:gap-2" style={{ gridTemplateColumns: `2rem repeat(${cols.length}, minmax(0, 1fr))` }}>
          <span />
          {cols.map((c) => (
            <span key={c} className="text-center font-title text-sm sm:text-base text-torii pb-1">
              {c}
            </span>
          ))}
          {children}
        </div>
      </div>
    </section>
  )
}

function Row({ label, children }) {
  return (
    <>
      <span className="flex items-center justify-center font-title text-sm sm:text-base text-sky">{label}</span>
      {children}
    </>
  )
}

function Empty() {
  return <span className="rounded-xl bg-sunken/50" />
}

function Cell({ hira, script, onPick }) {
  const kata = toKatakana(hira)
  const combo = hira.length > 1
  const size = combo ? 'text-2xl sm:text-4xl' : 'text-3xl sm:text-5xl'
  return (
    <button
      type="button"
      onClick={() => onPick(hira)}
      className="rounded-xl bg-surface border-2 border-outline py-2 sm:py-3 flex flex-col items-center justify-center active:scale-95 active:bg-accent-soft hover:bg-sunken transition-all"
    >
      {script === 'both' ? (
        <span className="flex items-baseline gap-1 sm:gap-2" lang="ja">
          <span className={`font-jp font-bold leading-none ${combo ? 'text-lg sm:text-3xl' : 'text-2xl sm:text-4xl'}`}>{hira}</span>
          <span className={`font-jp font-bold leading-none text-ink/60 ${combo ? 'text-lg sm:text-3xl' : 'text-2xl sm:text-4xl'}`}>{kata}</span>
        </span>
      ) : (
        <span className={`font-jp font-bold leading-none ${size}`} lang="ja">
          {script === 'katakana' ? kata : hira}
        </span>
      )}
      <span className="text-[10px] sm:text-xs font-bold text-ink/45 mt-1">{ROMAJI.get(hira)}</span>
    </button>
  )
}
