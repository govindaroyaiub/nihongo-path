// Kamakura in the rainy season: the great bronze Buddha sits calm in the
// drizzle, hydrangeas nod in front, and soft light breaks through the clouds.
const INK = '#261e3e'

const CSS = `
.km-rain { animation: km-rain .75s linear infinite; }
.km-rain-far { animation: km-rain-far 1.3s linear infinite; }
.km-ripple { transform-box: fill-box; transform-origin: center; animation: km-ripple 1.8s ease-out infinite; }
.km-sway { transform-box: fill-box; transform-origin: 50% 100%; animation: km-sway 4s ease-in-out infinite; }
.km-beam { animation: km-beam 7s ease-in-out infinite; }
.km-glint { animation: km-glint 2.6s ease-in-out infinite; }
.km-drift { animation: km-drift 60s linear infinite; }
@keyframes km-rain { from { transform: translate(0, 0); } to { transform: translate(-20px, 160px); } }
@keyframes km-rain-far { from { transform: translate(0, 0); } to { transform: translate(-20px, 160px); } }
@keyframes km-ripple {
  0%   { transform: scale(.15); opacity: .95; }
  100% { transform: scale(1); opacity: 0; }
}
@keyframes km-sway { 0%, 100% { transform: rotate(-2.5deg); } 50% { transform: rotate(2.5deg); } }
@keyframes km-beam { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes km-glint { 0%, 100% { opacity: .15; } 50% { opacity: 1; } }
@keyframes km-drift { from { transform: translateX(0); } to { transform: translateX(-400px); } }
@media (prefers-reduced-motion: reduce) {
  .km-rain, .km-rain-far, .km-ripple, .km-sway, .km-beam, .km-glint, .km-drift { animation: none; }
  .km-ripple { transform: scale(.6); opacity: .5; }
}
`

// Rain streaks: each drawn twice (one tile up and right) so the fall loops seamlessly.
// Low-discrepancy spread so streaks never clump into hatching.
const spread = (n, seed) => Array.from({ length: n }, (_, i) => ({
  x: Math.round((((i + seed) * 0.618034) % 1) * 420),
  y: Math.round(40 + (((i + seed) * 0.754878) % 1) * 160),
}))
const RAIN = spread(44, 1)
const RAIN_FAR = spread(36, 50)

const FLORETS = [[0, 0], [-5, -3], [5, -3], [-4, 4], [4, 4], [0, -6.5], [-7, 1], [7, 1], [0, 6.5]]

const BLUE = ['#4f7fe0', '#a9c6ff']
const PURPLE = ['#8a5cd6', '#d3b8ff']
const SKY = ['#6fb3ec', '#d5ecff']

const BLOOMS = [
  { x: 66, y: 186, r: 9, c: PURPLE },
  { x: 78, y: 166, r: 11, c: BLUE },
  { x: 104, y: 160, r: 10, c: PURPLE },
  { x: 128, y: 172, r: 10, c: SKY },
  { x: 96, y: 184, r: 11, c: BLUE },
  { x: 140, y: 190, r: 9, c: PURPLE },
  { x: 272, y: 170, r: 10, c: PURPLE },
  { x: 296, y: 160, r: 11, c: BLUE },
  { x: 322, y: 168, r: 10, c: PURPLE },
  { x: 262, y: 190, r: 9, c: BLUE },
  { x: 304, y: 185, r: 11, c: SKY },
  { x: 332, y: 188, r: 9, c: BLUE },
]

const LEAVES = [
  [62, 176, -30], [88, 174, 20], [116, 170, -15], [140, 180, 30], [74, 196, 10], [120, 194, -20], [150, 198, 15],
  [262, 180, -25], [284, 172, 20], [312, 176, -10], [338, 176, 30], [282, 196, 15], [326, 198, -20], [252, 198, -10],
]

function Hydrangea({ x, y, r, c, delay }) {
  const [base, light] = c
  const k = r / 10
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="km-sway" style={{ animationDelay: `${delay}s` }}>
        <circle r={r} fill={base} stroke={INK} strokeWidth="1.5" />
        {FLORETS.map(([fx, fy], i) => (
          <g key={i} transform={`translate(${fx * k} ${fy * k})`} fill={light}>
            <circle cx="-1.1" r="1.05" />
            <circle cx="1.1" r="1.05" />
            <circle cy="-1.1" r="1.05" />
            <circle cy="1.1" r="1.05" />
          </g>
        ))}
        <path d={`M${-r * 0.6} ${-r * 0.55} Q${-r * 0.2} ${-r * 0.95} ${r * 0.3} ${-r * 0.8}`} stroke="#fff" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity=".6" />
      </g>
    </g>
  )
}

export default function KamakuraScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="km-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c5c9c" />
          <stop offset=".3" stopColor="#8f8ccc" />
          <stop offset=".5" stopColor="#c9afd9" />
          <stop offset=".6" stopColor="#f3c9cf" />
          <stop offset=".66" stopColor="#ffe2c6" />
        </linearGradient>
        <radialGradient id="km-glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff8e0" />
          <stop offset=".4" stopColor="#ffe9c2" stopOpacity=".7" />
          <stop offset="1" stopColor="#ffd3c2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="km-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fb6e8" />
          <stop offset="1" stopColor="#6c84c8" />
        </linearGradient>
        <linearGradient id="km-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a86a8" />
          <stop offset="1" stopColor="#4e4870" />
        </linearGradient>
        <linearGradient id="km-bronze" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3f7468" />
          <stop offset=".45" stopColor="#6aa894" />
          <stop offset="1" stopColor="#3a6a60" />
        </linearGradient>
        <linearGradient id="km-puddle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3d6dc" />
          <stop offset="1" stopColor="#8f8ccc" />
        </linearGradient>
        <linearGradient id="km-beam-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6dc" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#km-sky)" />

      {/* Light breaking through the rain clouds */}
      <circle cx="318" cy="64" r="56" fill="url(#km-glow)" />
      <g className="km-beam">
        <path d="M300 48 L322 48 L250 200 L196 200 Z" fill="url(#km-beam-g)" />
        <path d="M328 50 L340 50 L312 200 L282 200 Z" fill="url(#km-beam-g)" opacity=".7" />
      </g>

      {/* Soft rain clouds drifting */}
      <g className="km-drift" opacity=".7">
        {[0, 400].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`} fill="#e4dcf2">
            <ellipse cx="70" cy="56" rx="62" ry="10" />
            <ellipse cx="200" cy="48" rx="70" ry="9" />
            <ellipse cx="330" cy="62" rx="50" ry="7" />
          </g>
        ))}
      </g>

      {/* The sea glinting far behind */}
      <rect y="110" width="400" height="18" fill="url(#km-sea)" />
      {[[64, 116], [92, 119], [120, 115], [276, 117], [306, 120], [334, 115], [150, 121], [252, 121]].map(([x, y], i) => (
        <path key={i} d={`M${x - 5} ${y} H${x + 5}`} stroke="#fff" strokeWidth="1.2" strokeLinecap="round" className="km-glint" style={{ animationDelay: `${(i * 0.43) % 2.6}s` }} />
      ))}

      {/* Misty hills and the grove behind the Buddha */}
      <path d="M0 124 Q40 114 80 121 T160 119 T240 117 T320 121 T400 115 L400 152 L0 152 Z" fill="#7484b0" />
      <g fill="#3f6b62">
        <circle cx="128" cy="134" r="20" />
        <circle cx="156" cy="120" r="22" />
        <circle cx="200" cy="112" r="26" />
        <circle cx="244" cy="120" r="22" />
        <circle cx="272" cy="134" r="20" />
        <rect x="108" y="130" width="184" height="22" />
      </g>
      <g fill="#4f8072" opacity=".8">
        <circle cx="150" cy="116" r="8" />
        <circle cx="196" cy="100" r="9" />
        <circle cx="246" cy="114" r="8" />
      </g>

      {/* Wet gravel ground and the stone path */}
      <rect y="148" width="400" height="52" fill="url(#km-ground)" />
      <path d="M176 156 L224 156 L272 200 L128 200 Z" fill="#aaa6c4" />
      {[166, 176, 188].map((y, i) => (
        <path key={y} d={`M${170 - i * 9} ${y} H${230 + i * 9}`} stroke="#8a86a8" strokeWidth="1" />
      ))}

      {/* The great Buddha */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="144" y="148" width="112" height="9" fill="#9a96b0" />
        <path d="M150 148 L156 140 L244 140 L250 148 Z" fill="#7d8796" />
        {/* torso and robe */}
        <path d="M170 128 Q165 104 180 96 Q200 90 220 96 Q235 104 230 128 Z" fill="url(#km-bronze)" />
        <path d="M181 99 Q191 112 186 127" fill="none" strokeWidth="1" opacity=".6" />
        <path d="M219 99 Q209 112 214 127" fill="none" strokeWidth="1" opacity=".6" />
        <path d="M188 96 Q200 106 212 96" fill="none" strokeWidth="1" opacity=".6" />
        {/* crossed legs in the lap */}
        <path d="M150 141 Q152 124 172 120 L228 120 Q248 124 250 141 Q200 147 150 141 Z" fill="url(#km-bronze)" />
        <path d="M160 134 Q180 128 196 134" fill="none" strokeWidth="1" opacity=".6" />
        <path d="M240 134 Q220 128 204 134" fill="none" strokeWidth="1" opacity=".6" />
        {/* hands resting in meditation */}
        <ellipse cx="200" cy="122" rx="15" ry="5.5" fill="#5f9a88" />
        <path d="M193 119 Q200 115 207 119" fill="none" strokeWidth="1" />
        {/* ears, then head */}
        <ellipse cx="187.5" cy="84" rx="3" ry="8.5" fill="#4f8a7a" />
        <ellipse cx="212.5" cy="84" rx="3" ry="8.5" fill="#4f8a7a" />
        <ellipse cx="200" cy="67" rx="7" ry="5" fill="#4f8a7a" />
        <ellipse cx="200" cy="80" rx="12" ry="13.5" fill="url(#km-bronze)" />
      </g>
      {/* Curls, face, and the bronze sheen */}
      <g fill="#2f5c52">
        {[[-7, 71], [-3.5, 70], [0, 69.6], [3.5, 70], [7, 71], [-8, 74.5], [-4.5, 73.5], [-1.5, 73], [1.5, 73], [4.5, 73.5], [8, 74.5], [-3, 64.5], [0, 63.8], [3, 64.5]].map(([dx, y], i) => (
          <circle key={i} cx={200 + dx} cy={y} r=".9" />
        ))}
      </g>
      <g stroke={INK} strokeWidth="1" fill="none" strokeLinecap="round">
        <path d="M191.5 81 Q195 83 198 81" />
        <path d="M202 81 Q205 83 208.5 81" />
        <path d="M200 82.5 L199 86.5 L201.2 86.5" />
        <path d="M197 89.5 Q200 90.6 203 89.5" />
      </g>
      <circle cx="200" cy="77.5" r=".9" fill={INK} />
      <path d="M192 72 Q190 80 193 88" stroke="#a6dcc6" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".7" />
      <path d="M176 104 Q173 114 175 124" stroke="#a6dcc6" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".6" />

      {/* Puddle with rain ripples */}
      <ellipse cx="200" cy="184" rx="25" ry="5.5" fill="url(#km-puddle)" stroke={INK} strokeWidth="1.4" />
      {[[190, 184, 0], [210, 185, 0.6], [200, 183, 1.2]].map(([x, y, d], i) => (
        <ellipse key={i} cx={x} cy={y} rx="9" ry="2" fill="none" stroke="#fff" strokeWidth="1" className="km-ripple" style={{ animationDelay: `${d}s` }} />
      ))}

      {/* Hydrangea bushes */}
      <g fill="#2f6449" stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
        <ellipse cx="20" cy="190" rx="40" ry="18" stroke="none" />
        <ellipse cx="380" cy="190" rx="40" ry="18" stroke="none" />
        {LEAVES.map(([x, y, a], i) => (
          <ellipse key={i} cx={x} cy={y} rx="12" ry="6.5" transform={`rotate(${a} ${x} ${y})`} fill={i % 2 ? '#3d7a5a' : '#2f6449'} />
        ))}
      </g>
      {BLOOMS.map((b, i) => (
        <Hydrangea key={i} {...b} delay={-((i * 0.7) % 4)} />
      ))}

      {/* Gentle rain, two depths */}
      <g className="km-rain-far" stroke="#eef0ff" strokeWidth=".7" strokeLinecap="round" opacity=".45">
        {RAIN_FAR.map((d, i) => (
          <g key={i}>
            <path d={`M${d.x} ${d.y} l-1.2 6`} />
            <path d={`M${d.x + 20} ${d.y - 160} l-1.2 6`} />
          </g>
        ))}
      </g>
      <g className="km-rain" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity=".7">
        {RAIN.map((d, i) => (
          <g key={i}>
            <path d={`M${d.x} ${d.y} l-2 10`} />
            <path d={`M${d.x + 20} ${d.y - 160} l-2 10`} />
          </g>
        ))}
      </g>
    </svg>
  )
}
