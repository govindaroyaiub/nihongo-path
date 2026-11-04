// Kyoto in autumn: a tunnel of vermilion torii climbs a forest path while
// maple leaves tumble through slanting late-afternoon light.
const INK = '#261e3e'

const CSS = `
.ky-fall { animation: ky-fall 10s linear infinite; }
.ky-sway { animation: ky-sway 2.6s ease-in-out infinite alternate; }
.ky-tumble { transform-box: fill-box; transform-origin: center; animation: ky-tumble 3.2s linear infinite; }
.ky-beam { animation: ky-beam 7s ease-in-out infinite; }
.ky-glow { transform-box: fill-box; transform-origin: center; animation: ky-glow 5s ease-in-out infinite; }
.ky-rustle { transform-box: fill-box; transform-origin: 50% 100%; animation: ky-rustle 6s ease-in-out infinite; }
@keyframes ky-fall {
  0% { transform: translateY(0); opacity: 0; }
  8%, 90% { opacity: 1; }
  100% { transform: translateY(168px); opacity: 0; }
}
@keyframes ky-sway { from { transform: translateX(-9px); } to { transform: translateX(9px); } }
@keyframes ky-tumble {
  0% { transform: rotate(0deg) scaleX(1); }
  50% { transform: rotate(180deg) scaleX(.35); }
  100% { transform: rotate(360deg) scaleX(1); }
}
@keyframes ky-beam { 0%, 100% { opacity: .22; } 50% { opacity: .6; } }
@keyframes ky-glow { 0%, 100% { transform: scale(.92); opacity: .8; } 50% { transform: scale(1.08); opacity: 1; } }
@keyframes ky-rustle { 0%, 100% { transform: rotate(-1.2deg); } 50% { transform: rotate(1.2deg); } }
@media (prefers-reduced-motion: reduce) {
  .ky-fall, .ky-sway, .ky-tumble, .ky-beam, .ky-glow, .ky-rustle { animation: none; }
  .ky-fall { transform: translateY(var(--ky-rest)); }
  .ky-beam { opacity: .4; }
}
`

// Gates from the far end of the tunnel to the one framing the viewer.
const GATES = [0.12, 0.17, 0.235, 0.325, 0.45, 0.62, 0.86, 1.18].map((s) => ({
  s, cx: 200, by: 100 + s * 78, w: 220 * s, h: 150 * s,
}))

// x, delay, duration, colour, size, resting y for reduced motion
const LEAVES = [
  [70, 0, 9, '#ff5a2c', 1.1, 60],
  [120, -3.2, 11, '#ffa22c', 0.9, 110],
  [165, -6.5, 10, '#e8342a', 1.2, 30],
  [210, -1.4, 12, '#ffcf3a', 0.8, 90],
  [250, -7.8, 9.5, '#ff7a2c', 1, 130],
  [290, -4.6, 10.5, '#e8342a', 1.1, 50],
  [330, -2.2, 11.5, '#ffa22c', 0.95, 100],
  [95, -8.6, 12.5, '#ffcf3a', 0.85, 140],
  [190, -5.1, 9, '#ff5a2c', 1, 75],
  [310, -9.4, 10, '#ffcf3a', 0.9, 20],
  [30, -4, 11, '#e8342a', 1, 80],
  [375, -6, 10, '#ff7a2c', 1, 120],
]

const MAPLE = 'M0 -6 L1.5 -2.5 L5 -3.6 L3.6 0 L6 1.6 L2 2 L2.4 5 L0 3.4 L-2.4 5 L-2 2 L-6 1.6 L-3.6 0 L-5 -3.6 L-1.5 -2.5 Z'

const CANOPY = [
  [-6, 52, 26, '#b8322a'], [30, 44, 22, '#e8452c'], [62, 56, 18, '#ff7a2c'], [14, 76, 16, '#ffb43a'], [84, 42, 16, '#e8452c'],
  [406, 50, 26, '#b8322a'], [370, 42, 22, '#ff7a2c'], [338, 54, 18, '#e8452c'], [388, 78, 16, '#ffb43a'], [316, 40, 16, '#ff7a2c'],
]

const FALLEN = [
  [118, 186, '#ff5a2c'], [132, 194, '#ffcf3a'], [96, 178, '#e8342a'], [150, 170, '#ffa22c'], [276, 188, '#e8342a'],
  [262, 172, '#ffcf3a'], [300, 196, '#ff7a2c'], [240, 160, '#ff5a2c'], [170, 150, '#ffa22c'], [228, 182, '#ffcf3a'],
]

function Torii({ s, cx, by, w, h }) {
  const sw = Math.min(1.8, 0.4 + s * 1.2)
  const pt = w * 0.075
  const top = by - h
  const kt = h * 0.09
  const shade = pt * 0.32
  const nukiY = by - h * 0.74
  return (
    <g stroke={INK} strokeWidth={sw} strokeLinejoin="round" opacity={Math.min(1, 0.45 + s * 0.7)}>
      {[cx - w * 0.36, cx + w * 0.36].map((x) => (
        <g key={x}>
          <rect x={x - pt / 2} y={top + kt} width={pt} height={h - kt} fill="#ea4a2e" />
          <rect x={x + pt / 2 - shade} y={top + kt} width={shade} height={h - kt} fill="#b52f22" stroke="none" />
          <rect x={x - pt * 0.6} y={by - h * 0.08} width={pt * 1.2} height={h * 0.08} fill="#2b2233" />
        </g>
      ))}
      <rect x={cx - w * 0.47} y={nukiY} width={w * 0.94} height={h * 0.06} fill="#ea4a2e" />
      <rect x={cx - w * 0.035} y={top + kt * 1.8} width={w * 0.07} height={nukiY - top - kt * 1.8} fill="#ea4a2e" />
      <rect x={cx - w * 0.5} y={top + kt * 0.9} width={w} height={kt * 0.9} fill="#ea4a2e" />
      <path
        d={`M${cx - w * 0.57} ${top - kt * 0.6} Q${cx} ${top + kt * 0.5} ${cx + w * 0.57} ${top - kt * 0.6} L${cx + w * 0.52} ${top + kt} Q${cx} ${top + kt * 1.5} ${cx - w * 0.52} ${top + kt} Z`}
        fill="#2b2233"
      />
    </g>
  )
}

export default function KyotoScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="ky-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb86b" />
          <stop offset=".45" stopColor="#ffd98a" />
          <stop offset=".6" stopColor="#fff0bf" />
        </linearGradient>
        <linearGradient id="ky-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a3f2c" />
          <stop offset="1" stopColor="#2e1c2c" />
        </linearGradient>
        <linearGradient id="ky-path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d7a4" />
          <stop offset="1" stopColor="#a87856" />
        </linearGradient>
        <radialGradient id="ky-end" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fffbe0" />
          <stop offset=".4" stopColor="#ffe39a" stopOpacity=".85" />
          <stop offset="1" stopColor="#ffb86b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ky-beam-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6d0" stopOpacity=".85" />
          <stop offset="1" stopColor="#fff6d0" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#ky-sky)" />

      {/* Hazy far treeline, then trunks */}
      <path d="M0 102 Q20 72 50 84 T110 78 T170 90 T230 82 T290 88 T350 76 T400 84 L400 110 L0 110 Z" fill="#d8643e" opacity=".75" />
      <path d="M0 108 Q30 88 64 98 T130 96 T200 104 T270 96 T340 100 T400 94 L400 112 L0 112 Z" fill="#a8402e" opacity=".8" />
      {[[18, 5], [46, 4], [74, 6], [102, 3], [298, 3], [326, 6], [354, 4], [382, 5]].map(([x, w]) => (
        <rect key={x} x={x} y="40" width={w} height="90" fill="#4a2a2e" />
      ))}

      {/* Ground and the stone path climbing into the gates */}
      <rect y="100" width="400" height="100" fill="url(#ky-ground)" />
      <path d="M197 100 L203 100 L312 200 L88 200 Z" fill="url(#ky-path)" />
      {Array.from({ length: 10 }, (_, i) => {
        const e = ((i + 1) / 10) ** 1.7
        const y = 100 + e * 100
        const half = e * 110
        return <path key={i} d={`M${200 - half} ${y} H${200 + half}`} stroke="#8c6448" strokeWidth={0.4 + e * 1.4} />
      })}

      {/* Glow at the far end of the tunnel */}
      <circle cx="200" cy="96" r="34" fill="url(#ky-end)" className="ky-glow" />

      {GATES.map((g) => <Torii key={g.s} {...g} />)}

      {/* Autumn canopy overhead */}
      <g className="ky-rustle">
        {CANOPY.slice(0, 5).map(([x, y, r, c]) => (
          <circle key={x} cx={x} cy={y} r={r} fill={c} stroke={INK} strokeWidth="1.4" />
        ))}
      </g>
      <g className="ky-rustle" style={{ animationDelay: '-3s' }}>
        {CANOPY.slice(5).map(([x, y, r, c]) => (
          <circle key={x} cx={x} cy={y} r={r} fill={c} stroke={INK} strokeWidth="1.4" />
        ))}
      </g>

      {/* Leaves already on the ground */}
      {FALLEN.map(([x, y, c], i) => (
        <path key={i} d={MAPLE} fill={c} transform={`translate(${x} ${y}) rotate(${i * 47}) scale(.7)`} opacity=".9" />
      ))}

      {/* Stone fox guardian with a red bib */}
      <g transform="translate(322 190)">
        <g stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
          <rect x="-15" y="-12" width="30" height="12" fill="#8f8a92" />
          <rect x="-17" y="-15" width="34" height="3.5" fill="#a9a3ab" />
          <g transform="translate(0 -15)">
            <path d="M8 -2 Q19 -6 16 -19 Q14 -25 10 -21 Q12 -11 5 -6 Z" fill="#c9c3c4" />
            <path d="M-9 0 Q-11 -14 -5 -21 L3 -21 Q9 -12 9 0 Z" fill="#d6d0d0" />
            <path d="M-4 -20 Q-13 -21 -15 -24 Q-10 -28 -6 -28 L-6.5 -35 L-2 -29.5 L2 -29.5 L4.5 -35 L5 -26 Q5 -20 -4 -20 Z" fill="#d6d0d0" />
            <path d="M-8 -20 L5 -20 L-1.5 -12 Z" fill="#e8342a" />
          </g>
        </g>
        <path d="M-6 -42 L-3 -41" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="-11" cy="-3" rx="4" ry="1.6" fill="#7aa35a" opacity=".8" />
      </g>

      {/* Slanting late-afternoon light */}
      {['40,40 70,40 200,200 150,200', '122,40 136,40 262,200 236,200', '252,40 280,40 382,200 334,200'].map((pts, i) => (
        <polygon key={i} points={pts} fill="url(#ky-beam-g)" className="ky-beam" style={{ animationDelay: `${-i * 2.3}s` }} />
      ))}

      {/* Hero: maple leaves tumbling down */}
      {LEAVES.map(([x, delay, dur, c, k, rest], i) => (
        <g key={i} transform={`translate(${x} 32)`}>
          <g className="ky-fall" style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s`, '--ky-rest': `${rest}px` }}>
            <g className="ky-sway" style={{ animationDelay: `${-i * 0.7}s` }}>
              <g className="ky-tumble" style={{ animationDelay: `${-i * 0.45}s` }}>
                <path d={MAPLE} transform={`scale(${k})`} fill={c} stroke={INK} strokeWidth="0.7" strokeLinejoin="round" />
              </g>
            </g>
          </g>
        </g>
      ))}
    </svg>
  )
}
