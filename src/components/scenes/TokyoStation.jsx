// Tokyo Station at golden hour: the red-brick Marunouchi building glows
// in front of glass towers while a bullet train glides past on the viaduct.
const INK = '#261e3e'

const CSS = `
.ts-train { animation: ts-train 8s cubic-bezier(.3,0,.7,1) infinite; }
.ts-glow { animation: ts-glow 4s ease-in-out infinite; }
.ts-drift { animation: ts-drift 50s linear infinite; }
.ts-drift-slow { animation: ts-drift 85s linear infinite; }
.ts-bird { animation: ts-bird 16s linear infinite; }
.ts-up { animation: ts-up .6s linear infinite; }
.ts-down { animation: ts-down .6s linear infinite; }
.ts-pulse { animation: ts-pulse 5s ease-in-out infinite; }
@keyframes ts-train {
  0% { transform: translateX(-300px); }
  62%, 100% { transform: translateX(440px); }
}
@keyframes ts-glow { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
@keyframes ts-drift { from { transform: translateX(0); } to { transform: translateX(-400px); } }
@keyframes ts-bird {
  0% { transform: translate(-40px, 84px); }
  100% { transform: translate(440px, 64px); }
}
@keyframes ts-up { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes ts-down { 0%, 49% { opacity: 0; } 50%, 100% { opacity: 1; } }
@keyframes ts-pulse { 0%, 100% { opacity: .85; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .ts-train, .ts-glow, .ts-drift, .ts-drift-slow, .ts-bird, .ts-up, .ts-down, .ts-pulse { animation: none; }
  .ts-down { opacity: 0; }
}
`

// Glass towers of Marunouchi behind the station: [x, top, width]
const TOWERS = [
  [34, 72, 30], [68, 60, 26], [98, 78, 22], [128, 66, 30], [236, 58, 28], [268, 74, 22], [296, 62, 30], [330, 70, 34],
]

// Window grid across the long brick body
const WINDOWS = []
for (let x = 34; x < 366; x += 8) {
  for (const y of [119, 129.5, 140]) WINDOWS.push([x, y])
}

const BIRDS = [[0, 0], [14, -6], [26, 3]]

function Pavilion({ cx }) {
  return (
    <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
      <rect x={cx - 19} y="104" width="38" height="46" fill="url(#ts-brick)" />
      <path d={`M${cx - 19} 104 V150 M${cx + 19} 104 V150`} stroke="#f6ecd8" strokeWidth="2.4" />
      <path d={`M${cx - 19} 112.5 H${cx + 19} M${cx - 19} 126.5 H${cx + 19} M${cx - 19} 136.5 H${cx + 19}`} stroke="#f6ecd8" strokeWidth="1.4" />
      {[-11, -3.5, 4].map((dx) =>
        [117, 129.5, 140].map((y) => (
          <rect key={`${dx}-${y}`} x={cx + dx + 1.6} y={y} width="4" height="5.5" fill="url(#ts-window)" strokeWidth="0.8" />
        )),
      )}
      <rect x={cx - 21} y="101" width="42" height="4" fill="#f6ecd8" />
      <path d={`M${cx - 20} 101 Q${cx - 20} 86 ${cx} 82 Q${cx + 20} 86 ${cx + 20} 101 Z`} fill="url(#ts-dome)" />
      <path d={`M${cx - 9} 99 Q${cx - 8} 88 ${cx} 83 M${cx + 9} 99 Q${cx + 8} 88 ${cx} 83 M${cx} 83 V99`} fill="none" strokeWidth="0.9" opacity=".6" />
      <path d={`M${cx} 82 V75`} />
      <circle cx={cx} cy="74" r="1.8" fill="#ffd36b" strokeWidth="1" />
    </g>
  )
}

export default function TokyoStationScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="ts-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f4b9a" />
          <stop offset=".3" stopColor="#8a6fb8" />
          <stop offset=".5" stopColor="#f29a9a" />
          <stop offset=".64" stopColor="#ffbf74" />
          <stop offset=".76" stopColor="#ffe3a0" />
        </linearGradient>
        <radialGradient id="ts-sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff6cf" />
          <stop offset=".35" stopColor="#ffd98a" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffab6b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ts-tower" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6c67a8" />
          <stop offset=".6" stopColor="#a58bbf" />
          <stop offset="1" stopColor="#ffc28f" />
        </linearGradient>
        <linearGradient id="ts-brick" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2674c" />
          <stop offset="1" stopColor="#a8382f" />
        </linearGradient>
        <linearGradient id="ts-dome" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3b4068" />
          <stop offset=".55" stopColor="#5f6896" />
          <stop offset="1" stopColor="#f0a98a" />
        </linearGradient>
        <linearGradient id="ts-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff2b8" />
          <stop offset="1" stopColor="#ffb85c" />
        </linearGradient>
        <linearGradient id="ts-plaza" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3c58e" />
          <stop offset="1" stopColor="#c4836d" />
        </linearGradient>
        <linearGradient id="ts-warm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity=".35" />
        </linearGradient>
        <linearGradient id="ts-streak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity=".85" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#ts-sky)" />

      {/* Low sun peeking between the towers */}
      <circle cx="214" cy="98" r="48" fill="url(#ts-sun)" className="ts-pulse" />
      <circle cx="214" cy="98" r="14" fill="#fff6cf" />

      {/* Clouds drifting at two speeds (each drawn twice to loop) */}
      <g className="ts-drift-slow" opacity=".6">
        {[0, 400].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`} fill="#ffc6c0">
            <ellipse cx="70" cy="62" rx="46" ry="5" />
            <ellipse cx="270" cy="56" rx="58" ry="4.5" />
          </g>
        ))}
      </g>
      <g className="ts-drift" opacity=".8">
        {[0, 400].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`} fill="#ffe0b0">
            <ellipse cx="160" cy="80" rx="34" ry="4" />
            <ellipse cx="350" cy="72" rx="28" ry="3.5" />
          </g>
        ))}
      </g>

      {/* Modern towers */}
      <g stroke={INK} strokeWidth="1.2" strokeLinejoin="round" opacity=".92">
        {TOWERS.map(([x, top, w]) => (
          <g key={x}>
            <rect x={x} y={top} width={w} height={124 - top} fill="url(#ts-tower)" />
            {Array.from({ length: Math.floor((120 - top) / 5) }, (_, i) => (
              <path key={i} d={`M${x + 2} ${top + 4 + i * 5} H${x + w - 2}`} stroke="#fff" strokeWidth="0.6" opacity=".3" />
            ))}
            <rect x={x + w - 5} y={top + 2} width="3" height={120 - top} fill="#ffe6b8" stroke="none" opacity=".5" />
          </g>
        ))}
      </g>

      {/* Plaza */}
      <rect y="148" width="400" height="52" fill="url(#ts-plaza)" />
      <path d="M0 160 H400 M0 170 H400" stroke="#b9786a" strokeWidth="0.8" opacity=".5" />

      {/* Long red-brick station body */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="26" y="112" width="348" height="38" fill="url(#ts-brick)" />
        <rect x="24" y="109" width="352" height="4" fill="#4a4d72" />
        <path d="M26 126.5 H374 M26 136.5 H374" stroke="#f6ecd8" strokeWidth="1.4" />
      </g>
      {WINDOWS.map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="3.6"
          height="5"
          fill="url(#ts-window)"
          className={i % 5 === 0 ? 'ts-glow' : undefined}
          style={i % 5 === 0 ? { animationDelay: `${(i * 0.29) % 4}s` } : undefined}
        />
      ))}

      {/* Domed pavilions and central entrance */}
      <Pavilion cx={98} />
      <Pavilion cx={302} />
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="176" y="104" width="48" height="46" fill="url(#ts-brick)" />
        <path d="M176 104 V150 M224 104 V150" stroke="#f6ecd8" strokeWidth="2.4" />
        <path d="M171 105 L200 92 L229 105 Z" fill="#4a4d72" />
        <path d="M191 150 L191 140 Q200 132 209 140 L209 150 Z" fill="url(#ts-window)" />
        <rect x="184" y="108" width="32" height="9" rx="1" fill="#f6ecd8" />
        {[180, 213].map((x) => [121, 131].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="4" height="5.5" fill="url(#ts-window)" strokeWidth="0.8" />
        )))}
      </g>
      <text x="200" y="115" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="6.4" fill={INK}>
        東京駅
      </text>
      <rect x="26" y="104" width="348" height="46" fill="url(#ts-warm)" pointerEvents="none" />

      {/* Street trees and lamps along the plaza */}
      {[52, 140, 260, 348].map((x) => (
        <g key={x} stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
          <path d={`M${x} 166 V158`} />
          <ellipse cx={x} cy="155" rx="8" ry="6" fill="#5f9a62" />
          <path d={`M${x - 4} 153 Q${x} 150 ${x + 4} 152`} fill="none" stroke="#bfe39a" strokeWidth="1" />
        </g>
      ))}
      {[96, 200, 304].map((x) => (
        <g key={x} stroke={INK} strokeWidth="1.2">
          <path d={`M${x} 168 V156`} />
          <circle cx={x} cy="155" r="1.8" fill="#fff2b8" className="ts-glow" />
        </g>
      ))}

      {/* Birds crossing the evening sky */}
      <g className="ts-bird" transform="translate(150 70)">
        {BIRDS.map(([dx, dy], i) => (
          <g key={i} transform={`translate(${dx} ${dy})`} stroke={INK} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M-4 0 Q-2 -3 0 0 Q2 -3 4 0" className="ts-up" style={{ animationDelay: `${i * 0.2}s` }} />
            <path d="M-4 -1 Q-2 1.5 0 0 Q2 1.5 4 -1" className="ts-down" style={{ animationDelay: `${i * 0.2}s` }} />
          </g>
        ))}
      </g>

      {/* Viaduct */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="-10" y="184" width="420" height="20" fill="#a76e6a" stroke="none" opacity=".55" />
        {[44, 136, 228, 320].map((x) => (
          <rect key={x} x={x} y="183" width="12" height="20" fill="#e2d9e6" />
        ))}
        <rect x="-10" y="178" width="420" height="6" fill="#f1ecf4" />
      </g>

      {/* Bullet train gliding across */}
      <g className="ts-train" transform="translate(80 0)">
        <path d="M-70 168 H-30 M-80 173 H-26 M-62 177 H-28" stroke="url(#ts-streak)" strokeWidth="1.4" strokeLinecap="round" />
        <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
          <path d="M-22 178 Q-8 164 16 164 L58 164 L58 178 Z" fill="#fbfcff" />
          <rect x="60" y="164" width="58" height="14" fill="#fbfcff" />
          <rect x="120" y="164" width="58" height="14" fill="#fbfcff" />
          <path d="M180 164 L214 164 Q238 166 256 177 L256 178 L180 178 Z" fill="#fbfcff" />
        </g>
        <path d="M-12 173 H244" stroke="#2f62d6" strokeWidth="2.6" />
        <path d="M-6 175.6 H248" stroke="#8fb3ff" strokeWidth="0.9" />
        <path d="M6 168.5 H58 M64 168.5 H118 M124 168.5 H178 M184 168.5 H212" stroke="#33477e" strokeWidth="2.6" strokeDasharray="3 2" />
        <path d="M216 165.6 Q232 167 241 171 L220 171 Z" fill="#33477e" />
        <path d="M84 164 L88 159 L94 159 M144 164 L148 159 L154 159" stroke={INK} strokeWidth="1" fill="none" />
        <circle cx="251" cy="176" r="1.3" fill="#fff6c8" />
      </g>
    </svg>
  )
}
