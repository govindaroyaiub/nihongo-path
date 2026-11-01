import JpText from './JpText'
import SpeakButton from './SpeakButton'
import { Cloud } from './Anime'
import { speechText, toPlain } from '../lib/furigana'
import { stopFor, COLOR } from '../lib/journey'

const INK = '#261e3e'

// Hand-drawn landmark silhouettes, anime line-art style. Motifs without a
// drawing fall back to the stop's emoji.
const MOTIFS = {
  torii: (
    <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
      <path d="M22 40 Q60 30 98 40 L98 48 Q60 38 22 48 Z" fill="#ff4d3d" />
      <rect x="32" y="56" width="56" height="7" fill="#ff4d3d" />
      <rect x="38" y="46" width="9" height="62" fill="#ff4d3d" />
      <rect x="73" y="46" width="9" height="62" fill="#ff4d3d" />
      <rect x="56" y="48" width="8" height="10" fill="#ff4d3d" />
    </g>
  ),
  pagoda: (
    <g stroke={INK} strokeWidth="3" strokeLinejoin="round" fill="#ff6b4a">
      <path d="M60 18 L60 30" />
      <path d="M36 44 Q60 34 84 44 L78 48 L42 48 Z" />
      <rect x="46" y="48" width="28" height="12" fill="#fff3e0" />
      <path d="M32 66 Q60 54 88 66 L82 70 L38 70 Z" />
      <rect x="44" y="70" width="32" height="14" fill="#fff3e0" />
      <path d="M28 90 Q60 78 92 90 L86 94 L34 94 Z" />
      <rect x="42" y="94" width="36" height="14" fill="#fff3e0" />
    </g>
  ),
  castle: (
    <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
      <path d="M26 108 L34 84 L86 84 L94 108 Z" fill="#9aa3b5" />
      <rect x="40" y="62" width="40" height="22" fill="#fff8ec" />
      <path d="M32 64 Q60 52 88 64 L80 68 L40 68 Z" fill="#2fa36b" />
      <rect x="46" y="42" width="28" height="20" fill="#fff8ec" />
      <path d="M38 44 Q60 32 82 44 L76 48 L44 48 Z" fill="#2fa36b" />
      <path d="M50 30 L60 20 L70 30 Z" fill="#2fa36b" />
      <circle cx="52" cy="24" r="3" fill="#ffc52e" />
      <circle cx="68" cy="24" r="3" fill="#ffc52e" />
    </g>
  ),
  mountain: (
    <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
      <path d="M8 108 L48 40 Q60 30 72 40 L112 108 Z" fill="#5b7bd5" />
      <path d="M48 40 Q60 30 72 40 L80 54 L72 50 L66 58 L58 50 L50 58 L42 52 Z" fill="#fff" />
    </g>
  ),
  lantern: (
    <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
      <rect x="44" y="18" width="32" height="8" rx="2" fill="#2a2140" />
      <path d="M36 28 Q60 20 84 28 L86 88 Q60 96 34 88 Z" fill="#ff3d3d" />
      <path d="M36 44 Q60 40 84 44 M35 60 Q60 56 85 60 M35 76 Q60 72 85 76" fill="none" strokeWidth="2" opacity="0.4" />
      <text x="60" y="68" textAnchor="middle" fontFamily="Dela Gothic One, sans-serif" fontSize="22" fill="#2a2140" stroke="none">雷門</text>
      <rect x="44" y="90" width="32" height="8" rx="2" fill="#2a2140" />
    </g>
  ),
  tower: (
    <g stroke={INK} strokeWidth="3" strokeLinejoin="round" fill="#e8ecf5">
      <rect x="30" y="40" width="26" height="68" />
      <rect x="64" y="40" width="26" height="68" />
      <rect x="54" y="60" width="12" height="48" />
      <path d="M30 40 L43 26 L56 40 M64 40 L77 26 L90 40" fill="#c5cde0" />
      <path d="M36 52 h14 M36 64 h14 M36 76 h14 M70 52 h14 M70 64 h14 M70 76 h14" strokeWidth="2" opacity="0.5" />
    </g>
  ),
  onsen: (
    <g stroke={INK} strokeWidth="3" strokeLinejoin="round" fill="none">
      <ellipse cx="60" cy="92" rx="40" ry="14" fill="#7cc7ff" />
      <path d="M42 70 Q34 58 42 46 Q50 34 42 22 M60 70 Q52 58 60 46 Q68 34 60 22 M78 70 Q70 58 78 46 Q86 34 78 22" strokeLinecap="round" stroke="#ff6b6b" strokeWidth="4" />
    </g>
  ),
}

// A small anime landscape card for a place: sky, sun, clouds, ground, landmark.
export function PlaceArt({ place, unit, className = '', height = 160 }) {
  const stop = stopFor(unit)
  const motif = MOTIFS[place?.stamp?.motif]
  return (
    <div className={`relative overflow-hidden rounded-3xl border-[2.5px] border-outline ${className}`} style={{ height, boxShadow: '5px 5px 0 0 rgb(var(--outline))' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #3f8cff 0%, #8fd3ff 60%, #ffe0ec 100%)' }} />
      <div className="absolute right-8 top-5 w-14 h-14 rounded-full bg-[#ffe066] border-[2.5px] border-outline" />
      <Cloud className="absolute w-24 -left-4 top-4" />
      <Cloud className="absolute w-16 left-1/2 top-8" />
      <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="absolute bottom-0 w-full h-[34%]" aria-hidden>
        <path d="M0 20 Q100 0 200 16 T400 12 L400 60 L0 60 Z" fill="#7bd389" stroke={INK} strokeWidth="2.5" />
      </svg>
      <div className="absolute inset-x-0 bottom-2 flex justify-center">
        {motif ? (
          <svg viewBox="0 0 120 120" style={{ height: height * 0.78 }} aria-hidden>
            {motif}
          </svg>
        ) : (
          <span style={{ fontSize: height * 0.5 }} className="leading-none drop-shadow-[3px_3px_0_rgba(38,30,62,0.6)]">
            {stop.emoji}
          </span>
        )}
      </div>
    </div>
  )
}

// Goshuin-style temple stamp: red seal, brushed place name, visit date.
export function Stamp({ place, unit, earned, date, size = 132 }) {
  const stop = stopFor(unit)
  const kanji = place?.stamp?.kanji ?? stop.jp
  const when = date ? new Date(date) : null
  return (
    <div
      className={`relative flex flex-col items-center justify-between rounded-2xl border-[2.5px] py-3 ${earned ? 'bg-[#fffaf0] border-outline' : 'bg-sunken border-dashed border-outline/30'}`}
      style={{ width: size, height: size * 1.35, boxShadow: earned ? '4px 4px 0 0 rgb(var(--outline))' : undefined }}
    >
      {earned ? (
        <>
          <span className="font-hand text-[13px] text-[#261e3e]/70">奉拝</span>
          <div className="relative flex items-center justify-center" style={{ width: size * 0.72, height: size * 0.72 }}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-6" aria-hidden>
              <circle cx="50" cy="50" r="44" fill="none" stroke="#e23b3b" strokeWidth="6" />
              <circle cx="50" cy="50" r="36" fill="none" stroke="#e23b3b" strokeWidth="2" />
            </svg>
            <span className="relative font-hand font-extrabold text-[#e23b3b] leading-none -rotate-6 [writing-mode:vertical-rl]" style={{ fontSize: kanji.length > 2 ? size * 0.16 : size * 0.2 }}>
              {kanji}
            </span>
          </div>
          <span className="font-hand text-[11px] text-[#261e3e]/70">
            {when ? `${when.getFullYear()}.${when.getMonth() + 1}.${when.getDate()}` : ''}
          </span>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-1 text-ink/30">
          <span className="text-3xl grayscale opacity-60">{stop.emoji}</span>
          <span className="text-[11px] font-extrabold uppercase">Locked</span>
        </div>
      )}
      <span className="absolute -bottom-6 text-[11px] font-extrabold text-ink/60 whitespace-nowrap">{stop.place}</span>
    </div>
  )
}

const KIND_ICON = { temple: '🛕', shrine: '⛩️', castle: '🏯', nature: '🌿', street: '🏮', landmark: '📍', museum: '🏛️', garden: '🌸' }

// The full culture card: history, famous sites, fun facts, place words.
export function PlaceCard({ place, unit }) {
  const stop = stopFor(unit)
  const c = COLOR[stop.color]
  return (
    <div className="flex flex-col gap-5">
      <PlaceArt place={place} unit={unit} height={180} />
      <div>
        <p className={`eyebrow ${c.text}`}>
          {place.prefecture} · {place.region}
        </p>
        <div className="flex items-baseline gap-3 flex-wrap mt-1">
          <h2 className="font-title text-3xl leading-tight">{place.place}</h2>
          <JpText text={place.jp} className="text-xl font-bold text-ink/60" />
        </div>
        <p className="font-bold text-ink/70 mt-1">{place.tagline}</p>
      </div>

      <section className="panel p-5">
        <p className="eyebrow text-ink/45 mb-2">📜 History</p>
        <p className="text-[15px] leading-relaxed font-bold text-ink/85">{place.history}</p>
      </section>

      <section>
        <p className="eyebrow text-ink/45 mb-2.5">Famous sites</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {place.sites.map((s) => (
            <div key={s.name} className="panel p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none mt-0.5">{KIND_ICON[s.kind] ?? '📍'}</span>
                <div className="min-w-0">
                  <p className="font-extrabold leading-snug">{s.name}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <JpText text={s.jp} className="font-bold text-ink/60" />
                    {s.year && <span className="text-xs font-extrabold text-ink/40">· {s.year}</span>}
                  </div>
                </div>
              </div>
              <p className="text-sm font-bold text-ink/70 leading-relaxed mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {place.facts?.length > 0 && (
        <section className="rounded-3xl border-[2.5px] border-outline bg-sun/20 p-5">
          <p className="eyebrow text-sun-deep mb-2">✨ Did you know?</p>
          <ul className="flex flex-col gap-2">
            {place.facts.map((f) => (
              <li key={f} className="text-[15px] font-bold leading-relaxed text-ink/85 flex gap-2">
                <span>•</span>
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <p className="eyebrow text-ink/45 mb-2.5">Words you&apos;ll see here</p>
        <div className="panel divide-y-2 divide-line">
          {place.words.map((w) => (
            <div key={w.word} className="flex items-center gap-3 px-4 py-3">
              <JpText text={w.word} furigana className="text-xl font-bold" />
              <span className="flex-1 text-sm font-bold text-ink/60">{w.meaning}</span>
              <SpeakButton text={speechText(w.word)} size="sm" label={`Play ${toPlain(w.word)}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
