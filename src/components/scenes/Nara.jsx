// Nara park at dusk: the great wooden hall glows behind the lawn while
// spotted deer bow to each other and fireflies drift between the lanterns.
const INK = '#261e3e'

const CSS = `
.nr2-bow { transform-box: view-box; transform-origin: 0 0; animation: nr2-bow 5.5s ease-in-out infinite; }
.nr2-nod { transform-box: view-box; transform-origin: 0 0; animation: nr2-nod 3.6s ease-in-out infinite; }
.nr2-ear { transform-box: view-box; transform-origin: 0 0; animation: nr2-ear 3.4s ease-in-out infinite; }
.nr2-tail { transform-box: view-box; transform-origin: 0 0; animation: nr2-tail 2.6s ease-in-out infinite; }
.nr2-fly { animation: nr2-fly 7s ease-in-out infinite; }
.nr2-blink { animation: nr2-blink 2.4s ease-in-out infinite; }
.nr2-flicker { animation: nr2-flicker 3s ease-in-out infinite; }
.nr2-shine { animation: nr2-shine 4s ease-in-out infinite; }
.nr2-twinkle { animation: nr2-twinkle 3s ease-in-out infinite; }
@keyframes nr2-bow {
  0%, 30% { transform: rotate(0deg); }
  44%, 58% { transform: rotate(62deg); }
  74%, 100% { transform: rotate(0deg); }
}
@keyframes nr2-nod { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(14deg); } }
@keyframes nr2-ear {
  0%, 68%, 100% { transform: rotate(0deg); }
  74% { transform: rotate(-38deg); }
  80% { transform: rotate(6deg); }
  86% { transform: rotate(-26deg); }
  92% { transform: rotate(0deg); }
}
@keyframes nr2-tail {
  0%, 55%, 100% { transform: rotate(0deg); }
  62% { transform: rotate(-40deg); }
  70% { transform: rotate(10deg); }
  78% { transform: rotate(-30deg); }
  86% { transform: rotate(0deg); }
}
@keyframes nr2-fly {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(6px, -8px); }
  50% { transform: translate(-3px, -14px); }
  75% { transform: translate(-7px, -5px); }
}
@keyframes nr2-blink { 0%, 100% { opacity: .15; } 50% { opacity: 1; } }
@keyframes nr2-flicker { 0%, 100% { opacity: 1; } 40% { opacity: .72; } 55% { opacity: .95; } 70% { opacity: .8; } }
@keyframes nr2-shine { 0%, 60%, 100% { opacity: 0; } 75% { opacity: .9; } }
@keyframes nr2-twinkle { 0%, 100% { opacity: .9; } 50% { opacity: .25; } }
@media (prefers-reduced-motion: reduce) {
  .nr2-bow, .nr2-nod, .nr2-ear, .nr2-tail, .nr2-fly, .nr2-blink, .nr2-flicker, .nr2-shine, .nr2-twinkle { animation: none; }
  .nr2-blink { opacity: .8; }
}
`

const STARS = [[30, 48], [88, 58], [140, 46], [262, 50], [308, 44], [372, 56], [60, 70]]

// x, y, delay, duration
const FLIES = [
  [70, 150, 0, 7], [104, 128, -2, 8], [136, 170, -4.5, 6.5], [176, 140, -1.2, 9], [214, 168, -3.3, 7.5],
  [238, 132, -5.6, 8.5], [282, 160, -0.6, 7], [318, 136, -2.8, 9.5], [336, 176, -4, 6], [92, 186, -6, 8],
]

const SPOTS = [[-6, -20], [-2, -21.6], [2, -20.2], [-4, -17.6], [1, -18], [5, -19.6], [-9, -17.6]]

function Deer({ x, y, k, flip, headClass, earClass, tailClass, delay = 0 }) {
  const sw = 1.6 / k
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -k : k} ${k})`}>
      <ellipse cx="0" cy="0.5" rx="14" ry="2" fill="#1f2a2a" opacity=".35" />
      <g stroke={INK} strokeWidth={sw} strokeLinejoin="round">
        {[-10, -6, 5, 8.6].map((lx) => (
          <rect key={lx} x={lx} y="-13" width="2.6" height="13" fill="#a8623a" />
        ))}
        <g transform="translate(-12.5 -20)">
          <g className={tailClass} style={{ animationDelay: `${delay}s` }}>
            <path d="M0 0 Q-4.5 -1 -4.5 3 Q-2.5 4.5 0 2 Z" fill="#fff6e8" />
          </g>
        </g>
        <ellipse cx="0" cy="-17" rx="13.5" ry="7" fill="#c97c45" />
        <path d="M-10 -13 Q0 -10 10 -13" fill="none" stroke="#f6dcb8" strokeWidth={sw * 1.2} />
        {SPOTS.map(([sx, sy]) => (
          <circle key={`${sx}${sy}`} cx={sx} cy={sy} r=".95" fill="#fff6e8" stroke="none" />
        ))}
        <g transform="translate(9 -20)">
          <g className={headClass} style={{ animationDelay: `${delay}s` }}>
            <path d="M-4 2 Q-4 -6 -1 -12 L5 -12 Q5 -5 5 2 Z" fill="#c97c45" />
            <g transform="translate(0 -16.5)">
              <g className={earClass} style={{ animationDelay: `${delay}s` }}>
                <ellipse cx="-3.6" cy="-0.4" rx="3.8" ry="1.7" transform="rotate(22 -3.6 -0.4)" fill="#c97c45" />
                <ellipse cx="-3.8" cy="-0.4" rx="2.2" ry=".7" transform="rotate(22 -3.8 -0.4)" fill="#f2b0a0" stroke="none" />
              </g>
            </g>
            <ellipse cx="6.4" cy="-19.4" rx="3.4" ry="1.5" transform="rotate(-38 6.4 -19.4)" fill="#c97c45" />
            <ellipse cx="3" cy="-14.5" rx="4.8" ry="4" fill="#c97c45" />
            <path d="M5.5 -17 Q12 -15.6 12.6 -12.2 Q11 -10 6 -11 Z" fill="#d8945e" />
          </g>
        </g>
      </g>
      <g transform="translate(9 -20)">
        <g className={headClass} style={{ animationDelay: `${delay}s` }}>
          <circle cx="4.4" cy="-15.2" r="1" fill={INK} />
          <circle cx="12.2" cy="-12.4" r=".9" fill={INK} />
        </g>
      </g>
    </g>
  )
}

function Lantern({ x }) {
  return (
    <g transform={`translate(${x} 172) scale(1.2)`}>
      <circle cx="0" cy="-26" r="13" fill="url(#nr2-lamp)" className="nr2-flicker" />
      <g stroke={INK} strokeWidth="1.3" strokeLinejoin="round" fill="#a69fae">
        <rect x="-7" y="-4" width="14" height="4" />
        <rect x="-2.5" y="-18" width="5" height="14" />
        <rect x="-7" y="-21" width="14" height="3" />
        <rect x="-5" y="-31" width="10" height="10" />
        <rect x="-3" y="-29" width="6" height="6" fill="#ffd36a" className="nr2-flicker" />
        <path d="M-10 -31 Q-6 -33 -4 -37 L4 -37 Q6 -33 10 -31 Z" fill="#8c8496" />
        <circle cx="0" cy="-39" r="2.2" fill="#8c8496" />
      </g>
    </g>
  )
}

export default function NaraScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="nr2-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#241d5c" />
          <stop offset=".4" stopColor="#6e3c8e" />
          <stop offset=".62" stopColor="#e2708c" />
          <stop offset=".74" stopColor="#ffb67a" />
        </linearGradient>
        <linearGradient id="nr2-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5e8a52" />
          <stop offset="1" stopColor="#24382f" />
        </linearGradient>
        <linearGradient id="nr2-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4262" />
          <stop offset="1" stopColor="#2c2640" />
        </linearGradient>
        <linearGradient id="nr2-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1a0" />
          <stop offset=".5" stopColor="#f5c542" />
          <stop offset="1" stopColor="#c98a1e" />
        </linearGradient>
        <radialGradient id="nr2-lamp" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffe08a" stopOpacity=".8" />
          <stop offset="1" stopColor="#ffb44a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nr2-fly-g" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#f6ffb0" />
          <stop offset=".35" stopColor="#d8ff6a" stopOpacity=".7" />
          <stop offset="1" stopColor="#b8ff4a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="200" fill="url(#nr2-sky)" />
      {STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 ? 0.8 : 1.2} fill="#fff" className="nr2-twinkle" style={{ animationDelay: `${i * 0.43}s` }} />
      ))}
      <path d="M336 58 A9 9 0 1 0 346 72 A7 7 0 1 1 336 58 Z" fill="#fff4c8" />

      {/* Wooded hills behind the hall */}
      <path d="M0 128 Q50 104 110 116 T220 110 T320 114 T400 108 L400 140 L0 140 Z" fill="#4e3a6e" />
      <path d="M0 134 Q30 122 70 128 T150 126 T250 130 T340 124 T400 128 L400 142 L0 142 Z" fill="#3c4a5a" />

      {/* Lawn and gravel approach */}
      <rect y="138" width="400" height="62" fill="url(#nr2-grass)" />
      <path d="M186 141 L214 141 L262 200 L138 200 Z" fill="#d9c6a4" opacity=".55" />

      {/* The great hall */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="96" y="134" width="208" height="8" fill="#9a8f9e" />
        <rect x="112" y="108" width="176" height="27" fill="#f1e6d0" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={114 + i * 15.4} y="108" width="3.2" height="27" fill="#8a4b2e" strokeWidth="1" />
        ))}
        <rect x="186" y="116" width="28" height="19" fill="#ffcf7a" />
        <path d="M200 116 V135" strokeWidth="1" />
        <path d="M84 112 Q110 108 122 96 L278 96 Q290 108 316 112 Z" fill="url(#nr2-roof)" />
        <rect x="100" y="111" width="200" height="2.4" fill="#8a4b2e" strokeWidth="1" />
        <rect x="128" y="80" width="144" height="17" fill="#f1e6d0" />
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={130 + i * 17.2} y="84" width="2.8" height="13" fill="#8a4b2e" strokeWidth="1" />
        ))}
        <path d="M192 96 Q200 86 208 96 Z" fill="#ffcf7a" />
        <path d="M94 87 Q124 83 140 62 L260 62 Q276 83 306 87 Z" fill="url(#nr2-roof)" />
        <rect x="148" y="58" width="104" height="5" fill="#2c2640" />
        <path d="M152 59 Q146 50 151 44 Q155 51 160 59 Z" fill="url(#nr2-gold)" />
        <path d="M248 59 Q254 50 249 44 Q245 51 240 59 Z" fill="url(#nr2-gold)" />
      </g>
      {[...Array(9)].map((_, i) => (
        <path key={i} d={`M${148 + i * 13} 64 L${128 + i * 18} 86`} stroke="#6a6288" strokeWidth=".6" opacity=".6" />
      ))}
      <circle cx="152" cy="49" r="1.6" fill="#fff" className="nr2-shine" />
      <circle cx="249" cy="49" r="1.6" fill="#fff" className="nr2-shine" style={{ animationDelay: '-2s' }} />

      <Lantern x={74} />
      <Lantern x={326} />

      {/* Deer: a fawn nosing the grass, one bowing, one flicking ear and tail */}
      <Deer x={112} y={160} k={0.85} headClass="nr2-nod" earClass="nr2-ear" tailClass="nr2-tail" delay={-1.3} />
      <Deer x={152} y={184} k={1.55} headClass="nr2-bow" earClass="nr2-ear" tailClass="nr2-tail" delay={-0.5} />
      <Deer x={258} y={186} k={1.6} flip earClass="nr2-ear" tailClass="nr2-tail" delay={-2.2} />

      {/* Fireflies */}
      {FLIES.map(([x, y, delay, dur], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className="nr2-fly" style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s` }}>
            <circle r="4" fill="url(#nr2-fly-g)" className="nr2-blink" style={{ animationDelay: `${delay * 0.7}s` }} />
          </g>
        </g>
      ))}
    </svg>
  )
}
