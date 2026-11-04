// Narita Airport at dusk: the first stop. A jet comes in head-on, landing
// lights blazing, glides down the runway centre line, touches down and rolls
// toward you while the terminal glows and the tower beacon blinks.
const INK = '#261e3e'

const CSS = `
.nr-plane { animation: nr-land 11s linear infinite; }
.nr-glow { animation: nr-glow 1.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.nr-blink { animation: nr-blink 1.2s steps(1) infinite; }
.nr-twinkle { animation: nr-twinkle 3s ease-in-out infinite; }
.nr-chase { animation: nr-chase 1.6s linear infinite; }
.nr-drift { animation: nr-drift 40s linear infinite; }
.nr-drift-slow { animation: nr-drift 70s linear infinite; }
@keyframes nr-land {
  0%   { transform: translate(200px, 80px) scale(.14); opacity: 0; }
  8%   { opacity: 1; }
  50%  { transform: translate(200px, 144px) scale(.88); }
  58%  { transform: translate(200px, 156px) scale(1.3); }
  61%  { transform: translate(200px, 154.5px) scale(1.36); }
  64%  { transform: translate(200px, 158px) scale(1.42); }
  88%  { transform: translate(200px, 172px) scale(2.2); opacity: 1; }
  100% { transform: translate(200px, 180px) scale(2.6); opacity: 0; }
}
@keyframes nr-glow { 0%, 100% { opacity: .85; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
@keyframes nr-blink { 0%, 70% { opacity: 1; } 71%, 100% { opacity: .15; } }
@keyframes nr-twinkle { 0%, 100% { opacity: .9; } 50% { opacity: .2; } }
@keyframes nr-chase { 0% { opacity: 1; } 30%, 100% { opacity: .15; } }
@keyframes nr-drift { from { transform: translateX(0); } to { transform: translateX(-400px); } }
@media (prefers-reduced-motion: reduce) {
  .nr-plane, .nr-glow, .nr-blink, .nr-twinkle, .nr-chase, .nr-drift, .nr-drift-slow { animation: none; }
  .nr-plane { transform: translate(200px, 150px) scale(1); }
}
`

const STARS = [
  [24, 14], [70, 30], [112, 10], [160, 26], [205, 12], [250, 34], [292, 16], [338, 28], [380, 12], [140, 44], [54, 50],
]

// Approach lights along the runway edges, from the horizon to the viewer.
const EDGE = Array.from({ length: 9 }, (_, i) => {
  const t = (i + 1) / 10
  const ease = t * t
  return { y: 136 + ease * 64, l: 190 - ease * 140, r: 210 + ease * 140, r0: 0.6 + ease * 2.2, delay: (i * 0.16).toFixed(2) }
})

export default function NaritaScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="nr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1847" />
          <stop offset=".38" stopColor="#5b2f7e" />
          <stop offset=".62" stopColor="#d9566b" />
          <stop offset=".72" stopColor="#ff9a5a" />
          <stop offset=".8" stopColor="#ffd27a" />
        </linearGradient>
        <radialGradient id="nr-sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff4c2" />
          <stop offset=".35" stopColor="#ffd27a" stopOpacity=".9" />
          <stop offset="1" stopColor="#ff9a5a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nr-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b2a5e" />
          <stop offset="1" stopColor="#1a1433" />
        </linearGradient>
        <linearGradient id="nr-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#ffb067" />
        </linearGradient>
        <radialGradient id="nr-halo" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fffbe0" stopOpacity=".95" />
          <stop offset=".35" stopColor="#ffe9a0" stopOpacity=".45" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="200" fill="url(#nr-sky)" />
      {STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 ? 0.9 : 1.4} fill="#fff" className="nr-twinkle" style={{ animationDelay: `${(i * 0.37) % 3}s` }} />
      ))}

      {/* Sun sinking behind the hills */}
      <circle cx="268" cy="128" r="46" fill="url(#nr-sun)" />
      <circle cx="268" cy="128" r="15" fill="#fff4c2" />

      {/* Two cloud layers drifting at different speeds (each drawn twice to loop) */}
      <g className="nr-drift-slow" opacity=".55">
        {[0, 400].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`} fill="#ff9fb0">
            <ellipse cx="60" cy="70" rx="44" ry="6" />
            <ellipse cx="250" cy="58" rx="60" ry="5" />
          </g>
        ))}
      </g>
      <g className="nr-drift" opacity=".75">
        {[0, 400].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`} fill="#ffc0a8">
            <ellipse cx="140" cy="96" rx="38" ry="4" />
            <ellipse cx="350" cy="88" rx="30" ry="4" />
          </g>
        ))}
      </g>

      {/* Far hills */}
      <path d="M0 128 Q40 116 90 124 T190 120 T290 126 T400 118 L400 140 L0 140 Z" fill="#4a2c6e" />

      {/* Ground and runway in perspective */}
      <rect y="134" width="400" height="66" fill="url(#nr-ground)" />
      <path d="M190 135 L210 135 L360 200 L40 200 Z" fill="#2c2448" />
      {Array.from({ length: 6 }, (_, i) => {
        const a = ((i + 0.3) / 6) ** 2
        const b = ((i + 0.65) / 6) ** 2
        return <path key={i} d={`M${200 - a * 3} ${136 + a * 64} L${200 + a * 3} ${136 + a * 64} L${200 + b * 4} ${136 + b * 64} L${200 - b * 4} ${136 + b * 64} Z`} fill="#fff" opacity=".7" />
      })}
      {EDGE.map((p, i) => (
        <g key={i} className="nr-chase" style={{ animationDelay: `${p.delay}s` }}>
          <circle cx={p.l} cy={p.y} r={p.r0} fill="#ffe27a" />
          <circle cx={p.r} cy={p.y} r={p.r0} fill="#ffe27a" />
        </g>
      ))}

      {/* Terminal: wave roof, glowing glass (kept inside a phone-width crop) */}
      <g transform="translate(26 0)">
      <g stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
        <rect x="8" y="114" width="150" height="24" fill="#2a2347" />
        <rect x="14" y="119" width="138" height="15" fill="url(#nr-glass)" />
        <path d="M14 126.5 H152" stroke={INK} strokeWidth="1" opacity=".5" />
        {Array.from({ length: 11 }, (_, i) => (
          <path key={i} d={`M${26 + i * 11.5} 119 V134`} strokeWidth="1" opacity=".55" />
        ))}
        <path d="M2 115 Q40 104 82 112 T164 110 L164 115 L2 118 Z" fill="#e8ecf5" />
      </g>
      <text x="83" y="111.5" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="6.5" fill={INK}>
        成田空港
      </text>
      </g>

      {/* Control tower with blinking beacon */}
      <g transform="translate(-38 0)">
      <g stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
        <path d="M352 138 L356 98 L364 98 L368 138 Z" fill="#e8ecf5" />
        <path d="M346 98 L374 98 L370 88 L350 88 Z" fill="#2a2347" />
        <path d="M349 95 L371 95 L369 90 L351 90 Z" fill="#8fe3ff" stroke="none" />
        <rect x="348" y="84" width="24" height="4" fill="#e8ecf5" />
        <path d="M360 84 V76" />
      </g>
      <circle cx="360" cy="75" r="2.4" fill="#ff3b3b" className="nr-blink" />
      </g>

      {/* The jet, seen nose-on: wings level, gear down, landing lights on */}
      <g className="nr-plane">
        <ellipse cx="0" cy="3" rx="22" ry="12" fill="url(#nr-halo)" className="nr-glow" />
        <g stroke={INK} strokeWidth="1.1" strokeLinejoin="round">
          <path d="M-11 -9 L-2 -10.5 L2 -10.5 L11 -9 L11 -7.8 L-11 -7.8 Z" fill="#dfe6f2" />
          <path d="M-1.4 -7 L-0.9 -18 L0.9 -18 L1.4 -7 Z" fill="#ff4d3d" />
          <path d="M-31 2.5 L-6 -1 L6 -1 L31 2.5 L31 4.2 L6 2.2 L-6 2.2 L-31 4.2 Z" fill="#e8ecf5" />
          <path d="M0 5 V9 M-11 7 V10 M11 7 V10" />
          <rect x="-1.6" y="8.6" width="3.2" height="2.2" rx=".8" fill={INK} />
          <rect x="-12.6" y="9.4" width="3.2" height="2.2" rx=".8" fill={INK} />
          <rect x="9.4" y="9.4" width="3.2" height="2.2" rx=".8" fill={INK} />
          <circle cx="-11" cy="4.5" r="3.2" fill="#e8ecf5" />
          <circle cx="11" cy="4.5" r="3.2" fill="#e8ecf5" />
          <circle cx="0" cy="0" r="5.4" fill="#fff" />
        </g>
        <circle cx="-11" cy="4.5" r="1.7" fill="#3a3158" />
        <circle cx="11" cy="4.5" r="1.7" fill="#3a3158" />
        <path d="M-3.4 -1.4 Q0 -3.4 3.4 -1.4 L2.8 -0.2 Q0 -1.6 -2.8 -0.2 Z" fill="#2a2347" />
        <circle cx="-4.5" cy="3" r="1.5" fill="#fffbe0" />
        <circle cx="4.5" cy="3" r="1.5" fill="#fffbe0" />
        <circle cx="-31" cy="3.4" r="1.2" fill="#ff3b3b" className="nr-blink" />
        <circle cx="31" cy="3.4" r="1.2" fill="#3bff7a" className="nr-blink" />
      </g>
    </svg>
  )
}
