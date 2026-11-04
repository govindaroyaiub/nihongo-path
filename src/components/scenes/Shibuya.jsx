// Shibuya at night: the scramble crossing seen from above, with tiny
// people streaming across in every direction under flickering screens.
const INK = '#261e3e'

const COLORS = ['#ff6b8b', '#5fd3ff', '#ffd35f', '#9b8cff', '#7dffb0', '#ff9f5f', '#f2f2ff']

// Walkers: [x1, y1, x2, y2, seconds, offset]. Feet sit on the path; people
// nearer the viewer (larger y) are drawn a little bigger.
const WALKERS = [
  [100, 128, 305, 128, 14, 0],
  [302, 127, 100, 127, 15, 6],
  [118, 129, 305, 129, 13, 9],
  [96, 190, 330, 190, 12, 2],
  [330, 188, 96, 188, 11, 7],
  [112, 191, 330, 191, 13, 10],
  [115, 136, 290, 180, 12, 3],
  [290, 181, 115, 137, 13, 5],
  [290, 136, 115, 180, 11, 1],
  [115, 181, 290, 137, 12, 8],
  [101, 136, 94, 182, 9, 4],
  [312, 182, 306, 136, 10, 2],
  [200, 158, 110, 134, 10, 6],
  [205, 157, 300, 182, 11, 0],
]

const scaleAt = (y) => (0.8 + ((y - 126) / 64) * 0.45).toFixed(3)

const WALK_CSS = WALKERS.map(([x1, y1, x2, y2, d, o], i) => `
.sb-w${i} { animation: sb-w${i} ${d}s linear -${o}s infinite; }
@keyframes sb-w${i} {
  0% { transform: translate(${x1}px, ${y1}px) scale(${scaleAt(y1)}); opacity: 0; }
  6%, 94% { opacity: 1; }
  100% { transform: translate(${x2}px, ${y2}px) scale(${scaleAt(y2)}); opacity: 0; }
}`).join('')

const CSS = `
.sb-bob { animation: sb-bob .45s ease-in-out infinite alternate; }
.sb-flick { animation: sb-flick 5s steps(1) infinite; }
.sb-twinkle { animation: sb-twinkle 3s ease-in-out infinite; }
.sb-slide { animation: sb-slide 6s linear infinite; }
.sb-swap-a { animation: sb-swap 8s steps(1) infinite; }
.sb-swap-b { animation: sb-swap 8s steps(1) -4s infinite; }
.sb-red { animation: sb-swap 10s steps(1) infinite; }
.sb-green { animation: sb-swap 10s steps(1) -5s infinite; }
.sb-wall { animation: sb-wall 2.4s ease-in-out infinite alternate; }
@keyframes sb-bob { from { transform: translateY(0); } to { transform: translateY(-.8px); } }
@keyframes sb-flick { 0%, 100% { opacity: 1; } 62% { opacity: .35; } 64% { opacity: 1; } 67% { opacity: .5; } 69% { opacity: 1; } }
@keyframes sb-twinkle { 0%, 100% { opacity: .9; } 50% { opacity: .25; } }
@keyframes sb-slide { from { transform: translateX(0); } to { transform: translateX(-84px); } }
@keyframes sb-swap { 0% { opacity: 1; } 50% { opacity: 0; } }
@keyframes sb-wall { from { opacity: .55; } to { opacity: 1; } }
${WALK_CSS}
@media (prefers-reduced-motion: reduce) {
  [class^='sb-'], [class*=' sb-'] { animation: none !important; }
  .sb-swap-b, .sb-green { opacity: 0; }
}
`

// Lit windows on the buildings: [x, y]
const WINDOWS = [
  [36, 100], [44, 100], [52, 100], [36, 108], [52, 108], [100, 100], [116, 108], [108, 108],
  [150, 104], [158, 110], [242, 104], [234, 110], [278, 98], [286, 106], [302, 98], [318, 106], [342, 98], [358, 106],
]

const STARS = [[30, 46], [134, 44], [262, 48], [380, 44]]

function Person({ color }) {
  return (
    <g className="sb-bob">
      <ellipse cx="0" cy="0" rx="2.8" ry=".9" fill="#000" opacity=".35" />
      <g stroke={INK} strokeWidth="1" strokeLinejoin="round">
        <rect x="-2.2" y="-10" width="4.4" height="8" rx="2.2" fill={color} />
        <circle cx="0" cy="-12.2" r="2.1" fill="#ffe0c7" />
      </g>
    </g>
  )
}

export default function ShibuyaScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="sb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d0b28" />
          <stop offset=".5" stopColor="#2b1c58" />
          <stop offset="1" stopColor="#5b2a78" />
        </linearGradient>
        <linearGradient id="sb-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2e2850" />
          <stop offset="1" stopColor="#1b1631" />
        </linearGradient>
        <linearGradient id="sb-scr-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff4fa3" />
          <stop offset="1" stopColor="#7a3cff" />
        </linearGradient>
        <linearGradient id="sb-scr-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#123a7a" />
          <stop offset="1" stopColor="#0b1838" />
        </linearGradient>
        <linearGradient id="sb-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7ac0" stopOpacity=".35" />
          <stop offset="1" stopColor="#ff7ac0" stopOpacity="0" />
        </linearGradient>
        <clipPath id="sb-clip">
          <rect x="158" y="54" width="84" height="44" />
        </clipPath>
      </defs>

      <rect width="400" height="200" fill="url(#sb-sky)" />
      {STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9" fill="#fff" className="sb-twinkle" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}

      {/* Buildings and their screens */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="-4" y="70" width="34" height="50" fill="#1f1a40" />
        <rect x="30" y="54" width="98" height="66" fill="#2a2350" />
        <rect x="128" y="64" width="18" height="56" fill="#1f1a40" />
        <rect x="146" y="46" width="108" height="74" fill="#342a60" />
        <rect x="254" y="68" width="16" height="52" fill="#1f1a40" />
        <rect x="270" y="58" width="102" height="62" fill="#2a2350" />
        <rect x="372" y="74" width="32" height="46" fill="#1f1a40" />
      </g>
      {WINDOWS.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="3" fill="#ffd98a" className="sb-twinkle" style={{ animationDelay: `${(i * 0.53) % 3}s` }} />
      ))}

      {/* Left screen: 渋谷 with an electric flicker */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="58" y="62" width="62" height="30" rx="1.5" fill="url(#sb-scr-a)" />
      </g>
      <g className="sb-flick">
        <rect x="60" y="64" width="58" height="26" fill="#fff" opacity=".12" />
        <text x="89" y="83.5" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="16" fill="#fff" stroke="#ff4fa3" strokeWidth="1.6" paintOrder="stroke">
          渋谷
        </text>
      </g>

      {/* Big centre screen: sliding shapes and alternating text */}
      <rect x="158" y="54" width="84" height="44" rx="1.5" fill="url(#sb-scr-b)" stroke={INK} strokeWidth="1.8" />
      <g clipPath="url(#sb-clip)">
        <g className="sb-slide" opacity=".85">
          {[0, 84].map((dx) => (
            <g key={dx} transform={`translate(${dx} 0)`}>
              <circle cx="172" cy="64" r="9" fill="#ff4fa3" />
              <rect x="190" y="82" width="22" height="12" rx="6" fill="#ffd35f" />
              <circle cx="226" cy="62" r="5" fill="#5fd3ff" />
              <path d="M228 96 L238 76 L248 96 Z" fill="#7dffb0" />
            </g>
          ))}
        </g>
        <text x="200" y="82" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="10" fill="#fff" stroke="#1a1040" strokeWidth="2" paintOrder="stroke" className="sb-swap-a">
          スクランブル
        </text>
        <text x="200" y="83" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="13" fill="#fff" stroke="#1a1040" strokeWidth="2" paintOrder="stroke" className="sb-swap-b">
          ようこそ
        </text>
      </g>

      {/* Right screen: colour-cycling 東京 */}
      <rect x="282" y="66" width="56" height="26" rx="1.5" fill="#5fd3ff" stroke={INK} strokeWidth="1.6" />
      <rect x="283" y="67" width="54" height="24" fill="#ff9f5f" className="sb-swap-a" />
      <text x="310" y="84.5" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="13" fill="#fff" stroke={INK} strokeWidth="1.4" paintOrder="stroke">
        東京
      </text>
      <path d="M276 100 H366" stroke="#7dffb0" strokeWidth="1.4" className="sb-wall" />
      <path d="M36 96 H122" stroke="#5fd3ff" strokeWidth="1.4" className="sb-wall" style={{ animationDelay: '1.2s' }} />

      {/* Far sidewalk, road, corner plazas */}
      <rect y="110" width="400" height="12" fill="#3d3566" />
      <rect y="120" width="400" height="80" fill="url(#sb-road)" />
      <ellipse cx="110" cy="140" rx="14" ry="18" fill="url(#sb-glow)" />
      <ellipse cx="200" cy="140" rx="30" ry="14" fill="#5fd3ff" opacity=".06" />
      <ellipse cx="296" cy="140" rx="12" ry="16" fill="#ff9f5f" opacity=".08" />
      <path d="M0 120 H400" stroke={INK} strokeWidth="1.4" />
      <path d="M-2 132 L88 132 L80 202 L-2 202 Z" fill="#463d72" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M402 132 L318 132 L326 202 L402 202 Z" fill="#463d72" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />

      {/* Zebra stripes: thick dashed strokes draw stripes across each path */}
      <g stroke="#ebe7f7" fill="none" opacity=".85">
        <path d="M94 126 L312 126" strokeWidth="7" strokeDasharray="4 5" />
        <path d="M92 187 L330 187" strokeWidth="11" strokeDasharray="6 7" />
        <path d="M100 135 L93 181" strokeWidth="9" strokeDasharray="4 5" />
        <path d="M306 135 L313 181" strokeWidth="9" strokeDasharray="4 5" />
        <path d="M116 136 L290 179" strokeWidth="9" strokeDasharray="4 5" />
        <path d="M290 136 L116 179" strokeWidth="9" strokeDasharray="4 5" />
      </g>

      {/* Akita-dog statue on its plinth */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="56" y="162" width="24" height="13" fill="#8a84a8" />
        <rect x="54" y="160" width="28" height="3" fill="#a59fc2" />
        <path d="M61 160 L61 154 Q61 149 64.5 148 L64.5 144 Q63 141 60 141.5 L58 140.5 L60 138.5 L62 135 L64 137 L66 134.5 L67.5 138 Q70 141 69 146 L70.5 149 Q77 149.5 77 155 Q78.5 151 80 152.5 Q80 157 77 158.5 L77 160 Z" fill="#4a3f5e" />
        <path d="M65 148 Q68 150 67 160" fill="none" strokeWidth="1" opacity=".6" />
      </g>
      <circle cx="62.5" cy="139.5" r=".7" fill="#ffd98a" />

      {/* Crowd crossing in every direction */}
      {WALKERS.map(([x1, y1, x2, y2], i) => {
        const t = 0.15 + ((i * 0.37) % 0.7)
        const mx = x1 + (x2 - x1) * t
        const my = y1 + (y2 - y1) * t
        return (
          <g key={i} className={`sb-w${i}`} transform={`translate(${mx} ${my}) scale(${scaleAt(my)})`}>
            <Person color={COLORS[i % COLORS.length]} />
          </g>
        )
      })}

      {/* Pedestrian signal switching between red and green */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="334.5" y="138" width="3" height="40" fill="#5a5480" />
        <rect x="329" y="116" width="14" height="24" rx="2" fill="#1c1830" />
      </g>
      <circle cx="336" cy="122.5" r="3.8" fill="#4a2030" />
      <circle cx="336" cy="133.5" r="3.8" fill="#1d3a30" />
      <circle cx="336" cy="122.5" r="3.8" fill="#ff4d5e" className="sb-red" />
      <circle cx="336" cy="133.5" r="3.8" fill="#3bff9a" className="sb-green" />
    </svg>
  )
}
