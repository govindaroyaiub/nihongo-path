// Shinjuku at blue hour: rain slants across a skyline of flickering office
// windows while the street-level neon hums and glows on the wet road.
const INK = '#261e3e'

const CSS = `
.sj-win { animation: sj-win 7s steps(1) infinite; }
.sj-blink { animation: sj-blink 1.6s steps(1) infinite; }
.sj-hum { animation: sj-hum 5s linear infinite; }
.sj-rain { animation: sj-rain .45s linear infinite; }
.sj-rain-far { animation: sj-rain-far .8s linear infinite; }
.sj-drop { transform-box: fill-box; transform-origin: center; animation: sj-drop 1.8s ease-out infinite; }
.sj-shimmer { animation: sj-shimmer 2.4s ease-in-out infinite; }
.sj-twinkle { animation: sj-twinkle 3s ease-in-out infinite; }
@keyframes sj-win { 0%, 45% { opacity: 1; } 46%, 78% { opacity: .12; } 79%, 100% { opacity: 1; } }
@keyframes sj-blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: .15; } }
@keyframes sj-hum {
  0%, 18%, 22%, 61%, 63%, 66%, 100% { opacity: 1; }
  20% { opacity: .35; }
  62% { opacity: .25; }
  64.5% { opacity: .6; }
}
@keyframes sj-rain { from { transform: translateY(0); } to { transform: translateY(48px); } }
@keyframes sj-rain-far { from { transform: translateY(0); } to { transform: translateY(72px); } }
@keyframes sj-drop { 0% { transform: scale(.1); opacity: .9; } 100% { transform: scale(1); opacity: 0; } }
@keyframes sj-shimmer { 0%, 100% { opacity: .38; } 50% { opacity: .24; } }
@keyframes sj-twinkle { 0%, 100% { opacity: .8; } 50% { opacity: .2; } }
@media (prefers-reduced-motion: reduce) {
  .sj-win, .sj-blink, .sj-hum, .sj-rain, .sj-rain-far, .sj-drop, .sj-shimmer, .sj-twinkle { animation: none; }
  .sj-drop { opacity: 0; }
}
`

// Deterministic pseudo-random so the window pattern is stable between renders.
const rnd = (n) => {
  const s = Math.sin(n * 12.9898) * 43758.5453
  return s - Math.floor(s)
}

const FAR = [
  [0, 30, 112], [26, 24, 100], [60, 28, 118], [92, 22, 96], [150, 30, 108], [196, 26, 92], [232, 32, 114], [274, 24, 98], [300, 30, 110], [340, 26, 94], [372, 28, 114],
]

// x, width, roof height, fill
const NEAR = [
  [0, 44, 96, '#22265a'],
  [40, 38, 76, '#1b1e4c'],
  [76, 30, 112, '#262b62'],
  [104, 46, 70, '#1d2152'],
  [148, 34, 102, '#252a60'],
  [180, 40, 82, '#1b1e4c'],
  [218, 28, 116, '#262b62'],
  [244, 46, 80, '#1d2152'],
  [288, 32, 100, '#22265a'],
  [318, 40, 72, '#1b1e4c'],
  [356, 44, 106, '#252a60'],
]

const WINDOWS = NEAR.flatMap(([bx, bw, top], b) => {
  const cols = Math.floor((bw - 6) / 6)
  const rows = Math.floor((128 - top - 8) / 7)
  const left = bx + (bw - cols * 6) / 2 + 1.5
  const out = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = b * 97 + r * 13 + c
      const v = rnd(k)
      if (v < 0.28) continue
      out.push({
        key: k,
        x: left + c * 6,
        y: top + 8 + r * 7,
        fill: v > 0.82 ? '#9fe0ff' : '#ffe08a',
        flick: rnd(k + 0.5) < 0.3,
        dur: (5 + rnd(k + 0.25) * 7).toFixed(1),
        delay: (rnd(k + 0.75) * 9).toFixed(1),
      })
    }
  }
  return out
})

const BEACONS = [[59, 76, 0], [127, 70, 0.5], [264, 80, 1.1], [337, 72, 0.3]]

const SIGNS = [
  { x: 66, w: 52, text: '新宿', color: '#ff4fa3', glow: '#ffd1ea', size: 13, dur: 5 },
  { x: 148, w: 84, text: 'カラオケ', color: '#3fe6ff', glow: '#d6fbff', size: 12, dur: 6.5 },
  { x: 256, w: 80, text: 'ラーメン', color: '#ffb02e', glow: '#fff0c4', size: 12, dur: 4.2 },
]

const DROPS = [[92, 176, 0], [168, 184, 0.6], [214, 172, 1.2], [282, 182, 0.3], [326, 174, 0.9], [130, 192, 1.5], [250, 194, 0.45]]

const STARS = [[30, 50], [88, 46], [170, 56], [226, 48], [300, 54], [362, 46]]

function Signs() {
  return SIGNS.map((s, i) => (
    <g key={i} className="sj-hum" style={{ animationDuration: `${s.dur}s`, animationDelay: `-${i * 1.7}s` }}>
      <rect x={s.x} y="134" width={s.w} height="20" rx="3" fill="#140d2c" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <rect x={s.x + 2.5} y="136.5" width={s.w - 5} height="15" rx="2" fill="none" stroke={s.color} strokeWidth="1.4" filter="url(#sj-glow)" />
      <text x={s.x + s.w / 2} y={144 + s.size * 0.38} textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize={s.size} fill={s.glow} stroke={s.color} strokeWidth=".6" filter="url(#sj-glow)">
        {s.text}
      </text>
    </g>
  ))
}

export default function ShinjukuScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="sj-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".2" stopColor="#0b1240" />
          <stop offset=".42" stopColor="#1d2a78" />
          <stop offset=".58" stopColor="#4a4fa8" />
          <stop offset=".7" stopColor="#b0679f" />
          <stop offset=".78" stopColor="#f29a8a" />
        </linearGradient>
        <linearGradient id="sj-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1c44" />
          <stop offset="1" stopColor="#080a1e" />
        </linearGradient>
        <linearGradient id="sj-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c0e26" stopOpacity="0" />
          <stop offset="1" stopColor="#0c0e26" stopOpacity=".9" />
        </linearGradient>
        <linearGradient id="sj-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".08" />
          <stop offset="1" stopColor="#000" stopOpacity=".25" />
        </linearGradient>
        <filter id="sj-glow" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="sj-rain-p" width="24" height="48" patternUnits="userSpaceOnUse">
          <path d="M3 0 V11 M15 20 V32 M9 34 V43 M21 6 V14" stroke="#d4e2ff" strokeWidth=".7" strokeLinecap="round" />
        </pattern>
        <pattern id="sj-rain-far-p" width="36" height="72" patternUnits="userSpaceOnUse">
          <path d="M6 4 V20 M24 36 V54 M30 60 V70" stroke="#b9cbff" strokeWidth=".5" strokeLinecap="round" />
        </pattern>
      </defs>

      <rect width="400" height="200" fill="url(#sj-sky)" />
      {STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r=".9" fill="#fff" className="sj-twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}

      {/* Far skyline in haze */}
      <g fill="#2f3780" opacity=".85">
        {FAR.map(([x, w, top]) => (
          <rect key={x} x={x} y={top} width={w} height={162 - top} />
        ))}
      </g>
      <g fill="#ffd9a0" opacity=".45">
        {FAR.map(([x, w, top], i) => (
          <rect key={x} x={x + w / 2 - 1} y={top + 6 + (i % 3) * 5} width="2" height="2" />
        ))}
      </g>

      {/* Near towers with window grids */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        {NEAR.map(([x, w, top, fill]) => (
          <rect key={x} x={x} y={top} width={w} height={162 - top} fill={fill} />
        ))}
        <path d="M127 70 V62 M59 76 V70 M337 72 V64 M264 80 V74" />
        <rect x="112" y="66" width="10" height="4" fill="#1d2152" />
        <rect x="324" y="68" width="8" height="4" fill="#1b1e4c" />
      </g>
      {WINDOWS.map((w) => (
        <rect
          key={w.key}
          x={w.x}
          y={w.y}
          width="3"
          height="3.6"
          fill={w.fill}
          className={w.flick ? 'sj-win' : undefined}
          style={w.flick ? { animationDuration: `${w.dur}s`, animationDelay: `-${w.delay}s` } : undefined}
        />
      ))}
      {NEAR.map(([x, w, top]) => (
        <rect key={x} x={x} y={top} width={w} height={162 - top} fill="url(#sj-shade)" />
      ))}
      {BEACONS.map(([x, y, d]) => (
        <circle key={x} cx={x} cy={y - 8} r="2" fill="#ff3b3b" className="sj-blink" style={{ animationDelay: `${d}s` }} />
      ))}

      {/* Storefront band and neon signs */}
      <rect x="0" y="156" width="400" height="6" fill="#120f2a" stroke={INK} strokeWidth="1.4" />
      {[30, 132, 240, 346].map((x) => (
        <rect key={x} x={x} y="157.5" width="14" height="4.5" fill="#ffd79a" opacity=".8" />
      ))}
      <Signs />

      {/* Wet road with mirrored neon */}
      <rect y="162" width="400" height="38" fill="url(#sj-road)" />
      <g transform="translate(0 324) scale(1 -1)" className="sj-shimmer">
        <Signs />
      </g>
      <g opacity=".22">
        <rect x="88" y="164" width="8" height="30" fill="#ff4fa3" />
        <rect x="186" y="164" width="8" height="30" fill="#3fe6ff" />
        <rect x="292" y="164" width="8" height="30" fill="#ffb02e" />
      </g>
      <rect y="162" width="400" height="38" fill="url(#sj-fade)" />
      <path d="M0 172 H400 M0 186 H400" stroke="#3a4290" strokeWidth=".5" strokeDasharray="14 10" opacity=".5" />
      {DROPS.map(([x, y, d]) => (
        <ellipse key={x} cx={x} cy={y} rx="7" ry="1.8" fill="none" stroke="#bcd0ff" strokeWidth=".7" className="sj-drop" style={{ animationDelay: `${d}s` }} />
      ))}

      {/* Slanted rain, two depths */}
      <g transform="rotate(14 200 120)" opacity=".35">
        <rect className="sj-rain-far" x="-120" y="-160" width="640" height="440" fill="url(#sj-rain-far-p)" />
      </g>
      <g transform="rotate(14 200 120)" opacity=".6">
        <rect className="sj-rain" x="-120" y="-140" width="640" height="420" fill="url(#sj-rain-p)" />
      </g>
    </svg>
  )
}
