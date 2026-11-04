// Asakusa at twilight: the great red lantern sways under the temple gate
// while cherry petals drift past a distant pagoda and broadcast tower.
const INK = '#261e3e'

const CSS = `
.as-lantern { transform-box: fill-box; transform-origin: 50% 0; animation: as-sway 4.6s ease-in-out infinite; }
.as-glow { animation: as-glow 4.6s ease-in-out infinite; }
.as-petal { transform-box: fill-box; transform-origin: center; animation: as-fall 10s linear infinite; }
.as-twinkle { animation: as-twinkle 3.4s ease-in-out infinite; }
.as-blink { animation: as-blink 1.4s steps(1) infinite; }
.as-flicker { animation: as-flicker 2.6s ease-in-out infinite; }
@keyframes as-sway {
  0%, 100% { transform: rotate(-3.5deg); }
  50% { transform: rotate(3.5deg); }
}
@keyframes as-glow { 0%, 100% { opacity: .75; } 50% { opacity: 1; } }
@keyframes as-fall {
  0%   { transform: translate(0, -70px) rotate(0deg); opacity: 0; }
  10%  { opacity: .95; }
  50%  { transform: translate(-14px, 15px) rotate(170deg); }
  90%  { opacity: .95; }
  100% { transform: translate(-34px, 100px) rotate(340deg); opacity: 0; }
}
@keyframes as-twinkle { 0%, 100% { opacity: .9; } 50% { opacity: .2; } }
@keyframes as-blink { 0%, 60% { opacity: 1; } 61%, 100% { opacity: .15; } }
@keyframes as-flicker { 0%, 100% { opacity: .85; } 40% { opacity: 1; } 70% { opacity: .7; } }
@media (prefers-reduced-motion: reduce) {
  .as-lantern, .as-glow, .as-petal, .as-twinkle, .as-blink, .as-flicker { animation: none; }
}
`

const STARS = [
  [20, 46], [48, 58], [118, 50], [150, 60], [236, 52], [262, 60], [288, 48], [372, 62], [392, 46], [180, 46],
]

// Petals start at their still-frame spot; the animation carries them above
// and below it.
const PETALS = [
  [70, 70, 0], [104, 96, 2.1], [138, 62, 4.4], [166, 112, 6.3], [214, 74, 1.2], [246, 104, 3.3],
  [276, 66, 5.6], [306, 92, 7.4], [334, 72, 2.8], [92, 118, 8.1], [232, 120, 5], [322, 120, 0.7],
  [186, 88, 9], [58, 100, 3.9],
]

const PAGODA = Array.from({ length: 5 }, (_, i) => {
  const y = 148 - i * 12
  return { y, bw: 18 - i * 2.4, rw: 32 - i * 4 }
})

const BLOSSOMS_L = [[56, 58], [72, 50], [90, 58], [108, 54], [80, 64]]
const BLOSSOMS_R = [[344, 50], [330, 56], [360, 58], [376, 50], [352, 64]]

function Blossom({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-3" rx="2.4" ry="3" fill="#ffc2d6" stroke={INK} strokeWidth="0.8" transform={`rotate(${a})`} />
      ))}
      <circle r="1.3" fill="#ff7fa8" />
    </g>
  )
}

export default function AsakusaScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="as-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".2" stopColor="#1a1a4e" />
          <stop offset=".45" stopColor="#4b2a7a" />
          <stop offset=".6" stopColor="#b0457e" />
          <stop offset=".7" stopColor="#f08a5d" />
          <stop offset=".77" stopColor="#ffc77a" />
        </linearGradient>
        <radialGradient id="as-halo" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffd98a" stopOpacity=".85" />
          <stop offset=".45" stopColor="#ff9a4a" stopOpacity=".35" />
          <stop offset="1" stopColor="#ff7a3a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="as-paper" cx=".5" cy=".45" r=".6">
          <stop offset="0" stopColor="#ff8a5c" />
          <stop offset=".55" stopColor="#e2322c" />
          <stop offset="1" stopColor="#a8161f" />
        </radialGradient>
        <linearGradient id="as-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a2a5e" />
          <stop offset="1" stopColor="#1c1432" />
        </linearGradient>
        <linearGradient id="as-pillar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ef4a3a" />
          <stop offset="1" stopColor="#b3212a" />
        </linearGradient>
        <linearGradient id="as-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe3a0" />
          <stop offset="1" stopColor="#ff9f55" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#as-sky)" />
      {STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 ? 0.8 : 1.3} fill="#fff" className="as-twinkle" style={{ animationDelay: `${(i * 0.41) % 3.4}s` }} />
      ))}

      {/* Crescent moon */}
      <circle cx="124" cy="70" r="7" fill="#fff3c8" />
      <circle cx="127" cy="67.5" r="6.2" fill="#3f2770" />

      {/* Low city silhouette on the horizon */}
      <path d="M0 150 V140 H22 V134 H40 V142 H58 V136 H70 V146 H120 V138 H150 V144 H250 V136 H272 V142 H300 V138 H340 V132 H356 V140 H380 V136 H400 V150 Z" fill="#3a2458" />

      {/* Five-storey pagoda */}
      <g fill="#2e1f4f">
        <rect x="68" y="148" width="28" height="4" />
        {PAGODA.map((t, i) => (
          <g key={i}>
            <rect x={82 - t.bw / 2} y={t.y - 9} width={t.bw} height="9" />
            <path d={`M${82 - t.rw / 2} ${t.y - 8} Q82 ${t.y - 12} ${82 + t.rw / 2} ${t.y - 8} L${82 + t.rw / 2 - 4} ${t.y - 11.5} L${82 - t.rw / 2 + 4} ${t.y - 11.5} Z`} fill="#40285f" />
            <rect x="80.5" y={t.y - 6} width="3" height="3.5" fill="#ffb36b" className="as-flicker" style={{ animationDelay: `${i * 0.5}s` }} />
          </g>
        ))}
        <path d="M82 88 V72" stroke="#2e1f4f" strokeWidth="1.6" />
        {[76, 79, 82, 85].map((y) => (
          <rect key={y} x="79.5" y={y} width="5" height="1.2" fill="#40285f" />
        ))}
      </g>

      {/* Slim lattice broadcast tower */}
      <g>
        <path d="M309 150 L323 150 L318.5 82 L313.5 82 Z" fill="#33366e" />
        <path d="M310 146 L322 138 L310 130 L321 122 L311 114 L320 106 L312 98 L319 90 L313 84" fill="none" stroke="#9aa6ff" strokeWidth=".6" opacity=".7" />
        <rect x="310" y="100" width="12" height="6" rx="1.5" fill="#2a2c5e" />
        <rect x="311.5" y="102" width="9" height="2" fill="#9fe8ff" className="as-flicker" />
        <rect x="312.5" y="86" width="7" height="4" rx="1" fill="#2a2c5e" />
        <rect x="313.5" y="87.3" width="5" height="1.4" fill="#9fe8ff" />
        <path d="M316 82 V68" stroke="#33366e" strokeWidth="1.4" />
        <circle cx="316" cy="67" r="1.8" fill="#ff3b3b" className="as-blink" />
      </g>

      {/* Ground, stone path and warm light pool */}
      <rect y="150" width="400" height="50" fill="url(#as-ground)" />
      <path d="M168 180 L232 180 L280 200 L120 200 Z" fill="#6a4a7a" />
      <path d="M150 188 H250 M136 195 H264" stroke="#4a3060" strokeWidth="1" />
      <ellipse cx="200" cy="180" rx="80" ry="10" fill="#ffb366" opacity=".28" className="as-glow" />

      {/* Lantern halo behind the gate opening */}
      <circle cx="200" cy="130" r="58" fill="url(#as-halo)" className="as-glow" />

      {/* Gate: side screens, pillars, beam and roof */}
      <g stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
        <rect x="100" y="104" width="28" height="74" fill="#9e2229" />
        <rect x="105" y="112" width="18" height="34" fill="url(#as-screen)" />
        <path d="M105 123 H123 M105 134 H123 M114 112 V146" strokeWidth="1" />
        <rect x="272" y="104" width="28" height="74" fill="#9e2229" />
        <rect x="277" y="112" width="18" height="34" fill="url(#as-screen)" />
        <path d="M277 123 H295 M277 134 H295 M286 112 V146" strokeWidth="1" />

        <rect x="128" y="94" width="11" height="84" fill="url(#as-pillar)" />
        <rect x="261" y="94" width="11" height="84" fill="url(#as-pillar)" />
        <rect x="125" y="176" width="17" height="6" fill="#8a7f9a" />
        <rect x="258" y="176" width="17" height="6" fill="#8a7f9a" />

        <rect x="114" y="90" width="172" height="7" fill="#c8312b" />
        <rect x="112" y="86" width="176" height="4" fill="#f2b14a" />
        <path d="M100 87 Q148 84 166 73 L234 73 Q252 84 300 87 L304 82 Q262 79 246 67 L154 67 Q138 79 96 82 Z" fill="#3b2c4f" />
        <rect x="150" y="63" width="100" height="5" fill="#2b2238" />
        <path d="M150 63 L144 60 L146 68 L150 68 Z M250 63 L256 60 L254 68 L250 68 Z" fill="#2b2238" />
      </g>
      <path d="M108 83.5 Q150 81 170 72 M292 83.5 Q250 81 230 72" stroke="#6d5a8a" strokeWidth="1" fill="none" />

      {/* The great lantern, swaying from its cord */}
      <g className="as-lantern">
        <path d="M200 97 V102" stroke={INK} strokeWidth="1.6" />
        <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
          <path d="M180 107 Q174 131 181 154 L219 154 Q226 131 220 107 Q200 103 180 107 Z" fill="url(#as-paper)" />
          <path d="M178.5 114 Q200 111 221.5 114 M176.5 124 H223.5 M176.5 138 H223.5 M178.5 148 Q200 151 221.5 148" fill="none" strokeWidth=".8" opacity=".45" />
          <rect x="185" y="102" width="30" height="6" rx="1" fill="#2b2238" />
          <rect x="185" y="153" width="30" height="6" rx="1" fill="#2b2238" />
        </g>
        <path d="M188 105 H212 M188 156 H212" stroke="#f2b14a" strokeWidth="1" />
        <text x="200" y="128" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="15" fill={INK}>雷</text>
        <text x="200" y="147" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="15" fill={INK}>門</text>
        <path d="M200 159 V163" stroke={INK} strokeWidth="1.4" />
        <path d="M197 163 L203 163 L202 170 L198 170 Z" fill="#f2b14a" stroke={INK} strokeWidth="1" strokeLinejoin="round" />
      </g>

      {/* Cherry branches framing the top corners */}
      <path d="M30 44 Q60 50 84 56 T116 52 M72 52 Q78 60 84 66" stroke="#3a2240" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {BLOSSOMS_L.map(([x, y]) => <Blossom key={`l${x}`} x={x} y={y} />)}
      <path d="M400 46 Q370 50 352 56 T322 54 M356 56 Q352 62 350 66" stroke="#3a2240" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {BLOSSOMS_R.map(([x, y]) => <Blossom key={`r${x}`} x={x} y={y} />)}

      {/* Drifting petals */}
      {PETALS.map(([x, y, d], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path
            d="M0 0 Q2.6 -2.6 5.2 0 Q2.6 2.4 0 0 Z"
            fill={i % 2 ? '#ffd0df' : '#ffb3cc'}
            stroke={INK}
            strokeWidth=".5"
            className="as-petal"
            style={{ animationDelay: `-${d}s`, animationDuration: `${9 + (i % 4) * 1.3}s` }}
          />
        </g>
      ))}
    </svg>
  )
}
