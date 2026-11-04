// Harajuku on a sunny afternoon: heart and star balloons float up past the
// candy-coloured shops and the street arch, under a rainbow cotton-candy cloud.
const INK = '#261e3e'

const CSS = `
.hj-rise { animation: hj-rise 11s linear infinite; }
.hj-sway { transform-box: fill-box; transform-origin: 50% 100%; animation: hj-sway 3s ease-in-out infinite; }
.hj-bob { animation: hj-bob 6s ease-in-out infinite; }
.hj-spin { transform-box: fill-box; transform-origin: center; animation: hj-spin 30s linear infinite; }
.hj-spark { transform-box: fill-box; transform-origin: center; animation: hj-spark 2.4s ease-in-out infinite; }
.hj-bulb { animation: hj-bulb 1.5s steps(1) infinite; }
.hj-drift { animation: hj-drift 50s linear infinite; }
@keyframes hj-rise {
  0%   { transform: translate(0, 90px); opacity: 0; }
  8%   { opacity: 1; }
  50%  { transform: translate(7px, 0); }
  90%  { opacity: 1; }
  100% { transform: translate(-3px, -92px); opacity: 0; }
}
@keyframes hj-sway { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
@keyframes hj-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes hj-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes hj-spark { 0%, 100% { transform: scale(.3); opacity: .3; } 50% { transform: scale(1); opacity: 1; } }
@keyframes hj-bulb { 0%, 49% { opacity: 1; } 50%, 100% { opacity: .35; } }
@keyframes hj-drift { from { transform: translateX(0); } to { transform: translateX(-400px); } }
@media (prefers-reduced-motion: reduce) {
  .hj-rise, .hj-sway, .hj-bob, .hj-spin, .hj-spark, .hj-bulb, .hj-drift { animation: none; }
}
`

const HEART = 'M0 5 C-9 -1 -7 -10 0 -5 C7 -10 9 -1 0 5 Z'
const STAR = 'M0 -8 L2.4 -2.6 L8 -2.4 L3.6 1.2 L5 7 L0 3.8 L-5 7 L-3.6 1.2 L-8 -2.4 L-2.4 -2.6 Z'

// x, still-frame y, shape, colour, delay, duration
const BALLOONS = [
  [70, 120, 'h', '#ff6fae', 0, 11],
  [104, 96, 's', '#ffd84d', 4.5, 12],
  [150, 132, 'h', '#b48cff', 7.8, 10.5],
  [234, 110, 's', '#5fd8ff', 2.2, 11.5],
  [284, 128, 'h', '#ff8fa3', 9.4, 12.5],
  [318, 100, 's', '#6ee6b4', 5.9, 10],
  [190, 140, 'h', '#ff9ed1', 3.3, 13],
]

// x, width, roof y, wall, awning
const SHOPS = [
  [-30, 52, 100, '#d8c8ff', '#8f6bff'],
  [20, 56, 104, '#ffb8d6', '#ff6fae'],
  [76, 52, 94, '#b6f2dd', '#36c79a'],
  [128, 50, 110, '#d8c8ff', '#8f6bff'],
  [178, 46, 100, '#ffe39a', '#ff9f43'],
  [224, 52, 108, '#a9dcff', '#3d9bff'],
  [276, 54, 96, '#ffc3e1', '#ff5fa2'],
  [330, 60, 106, '#c7f5e3', '#2fc191'],
]

const SPARKS = [[62, 92, 0], [122, 80, 0.8], [168, 120, 1.6], [252, 124, 0.4], [302, 86, 1.2], [342, 124, 2], [210, 60, 1]]

const BULBS = Array.from({ length: 9 }, (_, i) => {
  const t = (i + 0.5) / 9
  const x = 139 + t * 122
  const y = (1 - t) ** 2 * 100 + 2 * (1 - t) * t * 56 + t * t * 100
  return { x, y, d: i % 2 ? 0.75 : 0 }
})

function Spark({ x, y, d }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 -5 Q1 -1 5 0 Q1 1 0 5 Q-1 1 -5 0 Q-1 -1 0 -5 Z" fill="#fff" stroke="#ffb3d9" strokeWidth=".6" className="hj-spark" style={{ animationDelay: `${d}s` }} />
    </g>
  )
}

export default function HarajukuScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="hj-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".2" stopColor="#6cc6ff" />
          <stop offset=".5" stopColor="#a8e0ff" />
          <stop offset=".8" stopColor="#ffe0f0" />
        </linearGradient>
        <radialGradient id="hj-sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fffbe0" />
          <stop offset=".4" stopColor="#fff0a0" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffe48a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hj-candy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd1ea" />
          <stop offset=".5" stopColor="#e6d4ff" />
          <stop offset="1" stopColor="#c8f3ff" />
        </linearGradient>
        <pattern id="hj-stripe" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <rect width="6" height="6" fill="#fff" />
          <rect width="3" height="6" fill="#ff8fc4" />
        </pattern>
        <linearGradient id="hj-walk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd6e8" />
          <stop offset="1" stopColor="#f6b8d6" />
        </linearGradient>
        <linearGradient id="hj-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d6f1ff" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#hj-sky)" />

      {/* Sun with slowly turning rays */}
      <circle cx="80" cy="66" r="30" fill="url(#hj-sun)" />
      <g className="hj-spin">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M80 50 L82 44 L78 44 Z" fill="#ffe27a" transform={`rotate(${i * 30} 80 66)`} />
        ))}
      </g>
      <circle cx="80" cy="66" r="10" fill="#fff3a8" stroke="#ffcf5a" strokeWidth="1.2" />

      {/* Little drifting clouds */}
      <g className="hj-drift" opacity=".9">
        {[0, 400].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`} fill="#fff">
            <ellipse cx="150" cy="58" rx="16" ry="5" />
            <ellipse cx="160" cy="54" rx="9" ry="5" />
            <ellipse cx="370" cy="76" rx="14" ry="4" />
            <ellipse cx="20" cy="88" rx="12" ry="3.5" />
          </g>
        ))}
      </g>

      {/* Rainbow cotton-candy cloud */}
      <g transform="translate(6 -6)">
      <g className="hj-bob">
        {['#ff8fc4', '#ffb27a', '#ffe36e', '#7ce8b8', '#7cc8ff', '#b79aff'].map((c, i) => (
          <path key={c} d={`M${262 + i * 4} 90 A${28 - i * 4} ${28 - i * 4} 0 0 1 ${318 - i * 4} 90`} fill="none" stroke={c} strokeWidth="4.2" />
        ))}
        <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round" fill="url(#hj-candy)">
          <path d="M248 94 Q246 84 256 84 Q258 76 267 80 Q274 78 276 86 Q284 88 280 95 Z" />
          <path d="M304 95 Q300 86 308 84 Q310 76 320 80 Q328 78 330 86 Q338 88 334 95 Z" />
        </g>
      </g>
      </g>

      {/* Candy-coloured shop fronts */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        {SHOPS.map(([x, w, top, wall, awn]) => (
          <g key={x}>
            <rect x={x} y={top} width={w} height={172 - top} fill={wall} />
            <rect x={x - 2} y={top - 4} width={w + 4} height="5" fill="#fff" />
            <rect x={x + 6} y={top + 6} width={w - 12} height="12" rx="3" fill="url(#hj-glass)" strokeWidth="1.2" />
            <path
              d={`M${x} ${top + 28} H${x + w} V${top + 34} ${Array.from({ length: Math.round(w / 8) }, (_, i) => {
                const step = w / Math.round(w / 8)
                const ex = x + w - (i + 1) * step
                return `Q${ex + step / 2} ${top + 39} ${ex} ${top + 34}`
              }).join(' ')} Z`}
              fill={awn}
            />
            <rect x={x + 6} y={top + 42} width={w * 0.45} height={172 - top - 46} fill="url(#hj-glass)" strokeWidth="1.2" />
            <rect x={x + w * 0.62} y={top + 46} width={w * 0.26} height={172 - top - 46} rx="2" fill="#fff6fb" strokeWidth="1.2" />
          </g>
        ))}
      </g>
      {/* Awning stripes */}
      {SHOPS.map(([x, w, top]) => (
        <g key={x} fill="#fff" opacity=".7">
          {Array.from({ length: Math.floor(w / 8) }, (_, i) => (
            <rect key={i} x={x + 2 + i * 8} y={top + 29} width="3.5" height="5" />
          ))}
        </g>
      ))}

      {/* Shop signs: crepe, heart, ice cream */}
      <g stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
        <path d="M96 98 L108 98 L102 114 Z" fill="#f5c27a" />
        <circle cx="99" cy="97" r="3.4" fill="#fff" />
        <circle cx="105" cy="96" r="3.4" fill="#fff" />
        <circle cx="102" cy="93" r="2.6" fill="#ff5f7e" />
        <path d="M303 104 C294 98 296 90 303 95 C310 90 312 98 303 104 Z" fill="#ff5fa2" />
        <path d="M44 120 L52 120 L48 130 Z" fill="#f5c27a" />
        <circle cx="48" cy="117" r="4" fill="#b6f2dd" />
        <path d="M352 112 L368 112 L360 124 Z" fill="#f5c27a" />
        <circle cx="356" cy="110" r="3.6" fill="#ffd1ea" />
        <circle cx="363" cy="109" r="3.6" fill="#e6d4ff" />
      </g>
      <text x="94" y="147" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="5.5" fill={INK}>クレープ</text>

      {/* Pastel pavement */}
      <rect y="172" width="400" height="28" fill="url(#hj-walk)" />
      <path d="M0 180 H400 M0 190 H400" stroke="#fff" strokeWidth="1" opacity=".7" />
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M${i * 30 + 10} 172 L${i * 30 - 4} 200`} stroke="#fff" strokeWidth="1" opacity=".55" />
      ))}

      {/* Street arch */}
      <path d="M139 100 Q200 56 261 100" fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <path d="M139 100 Q200 56 261 100" fill="none" stroke="#ff7eb6" strokeWidth="8" strokeLinecap="round" />
      <path d="M139 100 Q200 56 261 100" fill="none" stroke="#ffd1ea" strokeWidth="2" strokeLinecap="round" />
      {BULBS.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r="1.6" fill="#fff36e" className="hj-bulb" style={{ animationDelay: `${b.d}s` }} />
      ))}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="134" y="98" width="10" height="80" fill="url(#hj-stripe)" />
        <rect x="256" y="98" width="10" height="80" fill="url(#hj-stripe)" />
        <rect x="131" y="176" width="16" height="5" rx="1.5" fill="#b48cff" />
        <rect x="253" y="176" width="16" height="5" rx="1.5" fill="#b48cff" />
        <circle cx="139" cy="95" r="5" fill="#ffd84d" />
        <circle cx="261" cy="95" r="5" fill="#ffd84d" />
        <rect x="168" y="64" width="64" height="24" rx="7" fill="#fff7fb" />
        <path d="M168 76 C163 70 164 66 168 69 M232 76 C237 70 236 66 232 69" fill="none" strokeWidth="1.2" />
      </g>
      <path d="M172 76 C168.5 73.5 169.5 70 172 72 C174.5 70 175.5 73.5 172 76 Z M228 76 C224.5 73.5 225.5 70 228 72 C230.5 70 231.5 73.5 228 76 Z" fill="#ff6fae" />
      <text x="200" y="81.5" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="14" fill="#ff4f9a" stroke={INK} strokeWidth=".5">
        原宿
      </text>

      {/* Sparkles */}
      {SPARKS.map(([x, y, d]) => <Spark key={`${x}-${y}`} x={x} y={y} d={d} />)}

      {/* Rising heart and star balloons */}
      {BALLOONS.map(([x, y, shape, color, delay, dur], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className="hj-rise" style={{ animationDelay: `-${delay}s`, animationDuration: `${dur}s` }}>
            <g className="hj-sway" style={{ animationDelay: `-${(i * 0.7) % 3}s` }}>
              <path d="M0 6 Q2.5 11 0 16 Q-2.5 21 0 25" fill="none" stroke={INK} strokeWidth=".9" />
              <path d={shape === 'h' ? HEART : STAR} fill={color} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" transform="scale(1.15)" />
              <ellipse cx={shape === 'h' ? -3.5 : -1.5} cy={shape === 'h' ? -4 : -3} rx="1.6" ry="1" fill="#fff" opacity=".85" />
            </g>
          </g>
        </g>
      ))}
    </svg>
  )
}
