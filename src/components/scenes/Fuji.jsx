// Mt. Fuji at sunrise: the sun swells beside the snowy peak, clouds slide
// across its slopes and cherry petals drift past a red five-storey pagoda.
const INK = '#261e3e'

const CSS = `
.fj-pulse { transform-box: fill-box; transform-origin: center; animation: fj-pulse 6s ease-in-out infinite; }
.fj-rays { transform-box: fill-box; transform-origin: center; animation: fj-rays 80s linear infinite; }
.fj-drift { animation: fj-drift 45s linear infinite; }
.fj-drift-slow { animation: fj-drift 75s linear infinite; }
.fj-fall { animation: fj-fall 12s linear infinite; }
.fj-sway { animation: fj-sway 2.8s ease-in-out infinite alternate; }
.fj-tumble { transform-box: fill-box; transform-origin: center; animation: fj-tumble 3s linear infinite; }
.fj-bough-l { transform-box: fill-box; transform-origin: 0% 20%; animation: fj-bough 7s ease-in-out infinite; }
.fj-bough-r { transform-box: fill-box; transform-origin: 100% 20%; animation: fj-bough 7s ease-in-out infinite reverse; }
@keyframes fj-pulse { 0%, 100% { transform: scale(.9); opacity: .8; } 50% { transform: scale(1.12); opacity: 1; } }
@keyframes fj-rays { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes fj-drift { from { transform: translateX(0); } to { transform: translateX(-400px); } }
@keyframes fj-fall {
  0% { transform: translate(0, 0); opacity: 0; }
  8%, 90% { opacity: 1; }
  100% { transform: translate(-70px, 168px); opacity: 0; }
}
@keyframes fj-sway { from { transform: translateX(-7px); } to { transform: translateX(7px); } }
@keyframes fj-tumble {
  0% { transform: rotate(0deg) scaleY(1); }
  50% { transform: rotate(180deg) scaleY(.3); }
  100% { transform: rotate(360deg) scaleY(1); }
}
@keyframes fj-bough { 0%, 100% { transform: rotate(-1deg); } 50% { transform: rotate(1.2deg); } }
@media (prefers-reduced-motion: reduce) {
  .fj-pulse, .fj-rays, .fj-drift, .fj-drift-slow, .fj-fall, .fj-sway, .fj-tumble, .fj-bough-l, .fj-bough-r { animation: none; }
  .fj-fall { transform: translate(-20px, var(--fj-rest)); }
}
`

const SUN = [110, 100]

const RAYS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  const d = 0.06
  const r = 64
  const p = (ang) => `${(SUN[0] + Math.cos(ang) * r).toFixed(1)},${(SUN[1] + Math.sin(ang) * r).toFixed(1)}`
  return `${SUN[0]},${SUN[1]} ${p(a - d)} ${p(a + d)}`
})

// x, delay, duration, resting y for reduced motion, size, colour
const PETALS = [
  [90, 0, 11, 40, 1, '#ffd0de'], [150, -3, 13, 90, 0.8, '#ffb3c9'], [210, -6.4, 12, 30, 1.1, '#ffe3ec'],
  [260, -1.8, 14, 120, 0.9, '#ffb3c9'], [320, -8.2, 11.5, 70, 1, '#ffd0de'], [370, -4.4, 12.5, 100, 1.2, '#ffe3ec'],
  [420, -10, 13.5, 55, 0.9, '#ffb3c9'], [120, -9.1, 12, 135, 1, '#ffe3ec'], [240, -11.3, 13, 15, 0.85, '#ffd0de'],
  [440, -5.5, 11, 145, 1, '#ffd0de'], [180, -7.6, 14, 110, 1.1, '#ffb3c9'], [300, -2.6, 12, 25, 0.8, '#ffe3ec'],
  [60, -6, 13, 80, 0.9, '#ffd0de'], [400, -1, 12, 130, 1, '#ffb3c9'],
]

const PETAL = 'M0 -3.2 Q2.8 -1 1 3 L0 2.2 L-1 3 Q-2.8 -1 0 -3.2 Z'

const LEFT_BLOOMS = [[10, 62, 14], [32, 52, 12], [52, 66, 11], [74, 58, 12], [96, 54, 10], [113, 61, 7], [20, 86, 12], [44, 84, 9], [6, 108, 10]]
const RIGHT_BLOOMS = [[392, 52, 14], [370, 62, 12], [348, 52, 11], [328, 62, 8.5], [384, 82, 12], [396, 106, 10], [362, 84, 8]]
const LOW_BLOOMS = [[24, 180, 13], [52, 188, 11], [76, 194, 9], [8, 160, 10]]

// Blossom masses: an outline pass under a fill pass, so only the union is inked.
function Blooms({ items }) {
  return (
    <g>
      {items.map(([x, y, r]) => (
        <circle key={`o${x}${y}`} cx={x} cy={y} r={r} fill={INK} stroke={INK} strokeWidth="3" />
      ))}
      {items.map(([x, y, r]) => (
        <circle key={`f${x}${y}`} cx={x} cy={y} r={r} fill="#ffb8cf" />
      ))}
      {items.map(([x, y, r]) => (
        <g key={`h${x}${y}`}>
          <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.55} fill="#ffd9e5" />
          <circle cx={x + r * 0.35} cy={y + r * 0.2} r={r * 0.18} fill="#ff7fa8" />
          <circle cx={x - r * 0.45} cy={y + r * 0.35} r={r * 0.14} fill="#ff7fa8" />
        </g>
      ))}
    </g>
  )
}

const PX = 292
const PB = 156

export default function FujiScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="fj-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34408f" />
          <stop offset=".35" stopColor="#8a5aa8" />
          <stop offset=".58" stopColor="#ff8fa3" />
          <stop offset=".75" stopColor="#ffcf8a" />
        </linearGradient>
        <radialGradient id="fj-sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff6d0" />
          <stop offset=".3" stopColor="#ffd98a" stopOpacity=".9" />
          <stop offset="1" stopColor="#ff9a7a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fj-mtn" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7d8fd8" />
          <stop offset=".5" stopColor="#5160ad" />
          <stop offset="1" stopColor="#363a7a" />
        </linearGradient>
        <linearGradient id="fj-snow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff8f0" />
          <stop offset="1" stopColor="#d8dcf5" />
        </linearGradient>
        <linearGradient id="fj-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d6a4a" />
          <stop offset="1" stopColor="#1d2b2a" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#fj-sky)" />

      {/* Sun with slowly turning rays and a breathing halo */}
      <g className="fj-rays" opacity=".22">
        {RAYS.map((pts, i) => <polygon key={i} points={pts} fill="#fff4c2" />)}
      </g>
      <circle cx={SUN[0]} cy={SUN[1]} r="50" fill="url(#fj-sun)" className="fj-pulse" />
      <circle cx={SUN[0]} cy={SUN[1]} r="14" fill="#fff6d0" />

      {/* High cloud streaks */}
      <g className="fj-drift-slow" opacity=".55">
        {[0, 400].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`} fill="#ffd0dc">
            <ellipse cx="70" cy="66" rx="40" ry="4" />
            <ellipse cx="270" cy="56" rx="54" ry="4.5" />
          </g>
        ))}
      </g>

      {/* Mt. Fuji */}
      <g stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
        <path d="M10 178 Q120 120 176 74 Q200 66 224 74 Q280 120 390 178 Z" fill="url(#fj-mtn)" />
        <path d="M158 88 Q168 80 176 74 Q200 66 224 74 Q232 80 242 88 L234 93 L226 88 L218 97 L209 89 L200 99 L191 89 L182 97 L174 88 L166 93 Z" fill="url(#fj-snow)" />
      </g>
      <path d="M182 97 L176 112 M200 99 L198 116 M218 97 L222 110" stroke="#eef0ff" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />

      {/* Wisps of cloud sliding across the mountain's middle */}
      <g className="fj-drift" opacity=".85">
        {[0, 400].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`} fill="#fff">
            <ellipse cx="120" cy="124" rx="46" ry="5" />
            <ellipse cx="150" cy="119" rx="22" ry="4" />
            <ellipse cx="300" cy="130" rx="52" ry="5" />
            <ellipse cx="330" cy="125" rx="20" ry="3.5" />
          </g>
        ))}
      </g>

      {/* Morning mist at the foot of the mountain */}
      <rect y="150" width="400" height="22" fill="#fff" opacity=".22" />

      {/* Foreground hillside */}
      <path d="M0 200 L0 178 Q100 170 200 164 Q290 158 400 140 L400 200 Z" fill="url(#fj-hill)" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      {[[224, 162, 7], [244, 160, 8], [330, 150, 8], [352, 146, 9], [374, 143, 7]].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill="#2c5040" stroke={INK} strokeWidth="1.4" />
      ))}

      {/* Five-storey pagoda */}
      <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
        <rect x={PX - 26} y={PB} width="52" height="6" fill="#b9a9a4" />
        {Array.from({ length: 5 }, (_, i) => {
          const w = 46 - i * 5
          const bw = w * 0.55
          const yb = PB - i * 12
          return (
            <g key={i}>
              <rect x={PX - bw / 2} y={yb - 8} width={bw} height="8" fill="#e0402e" />
              <path d={`M${PX - bw / 2} ${yb - 4.5} H${PX + bw / 2}`} stroke="#ffe3b0" strokeWidth=".8" />
              <path
                d={`M${PX - w / 2} ${yb - 9} Q${PX - w / 2 + 6} ${yb - 8} ${PX - bw / 2 - 1} ${yb - 13} L${PX + bw / 2 + 1} ${yb - 13} Q${PX + w / 2 - 6} ${yb - 8} ${PX + w / 2} ${yb - 9} L${PX + w / 2 - 3} ${yb - 7} H${PX - w / 2 + 3} Z`}
                fill="#3b2b3f"
              />
            </g>
          )
        })}
        <rect x={PX - 1} y="77" width="2" height="18" fill="#c9a24a" />
        {[80, 84, 88].map((y) => (
          <rect key={y} x={PX - 3} y={y} width="6" height="1.6" fill="#c9a24a" strokeWidth="1" />
        ))}
        <circle cx={PX} cy="76" r="1.8" fill="#f5c542" strokeWidth="1" />
      </g>

      {/* Cherry blossoms framing the view */}
      <g className="fj-bough-l">
        <path d="M-6 70 Q40 58 70 64 Q92 68 114 58 M30 62 Q24 80 12 96" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M-6 70 Q40 58 70 64 Q92 68 114 58 M30 62 Q24 80 12 96" fill="none" stroke="#5a3038" strokeWidth="2.6" strokeLinecap="round" />
        <Blooms items={LEFT_BLOOMS} />
      </g>
      <g className="fj-bough-r">
        <path d="M406 60 Q372 62 350 56 Q336 54 326 62 M380 64 Q388 84 398 104" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M406 60 Q372 62 350 56 Q336 54 326 62 M380 64 Q388 84 398 104" fill="none" stroke="#5a3038" strokeWidth="2.6" strokeLinecap="round" />
        <Blooms items={RIGHT_BLOOMS} />
      </g>
      <Blooms items={LOW_BLOOMS} />

      {/* Hero: petals drifting on the morning breeze */}
      {PETALS.map(([x, delay, dur, rest, k, c], i) => (
        <g key={i} transform={`translate(${x} 34)`}>
          <g className="fj-fall" style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s`, '--fj-rest': `${rest}px` }}>
            <g className="fj-sway" style={{ animationDelay: `${-i * 0.6}s` }}>
              <g className="fj-tumble" style={{ animationDelay: `${-i * 0.4}s` }}>
                <path d={PETAL} transform={`scale(${k * 1.2})`} fill={c} stroke={INK} strokeWidth=".6" strokeLinejoin="round" />
              </g>
            </g>
          </g>
        </g>
      ))}
    </svg>
  )
}
