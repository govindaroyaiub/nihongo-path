// Lake Ashi at Hakone: a red torii stands in the water below the snowy
// volcano while an old sailing ship glides past and hot springs steam.
const INK = '#261e3e'

const CSS = `
.hk-ship { animation: hk-sail 26s linear infinite; }
.hk-bob { transform-box: fill-box; transform-origin: 50% 100%; animation: hk-bob 3.2s ease-in-out infinite; }
.hk-steam { transform-box: fill-box; transform-origin: 50% 100%; animation: hk-steam 4.5s ease-out infinite; }
.hk-shimmer { animation: hk-shimmer 3s ease-in-out infinite; }
.hk-wobble { transform-box: fill-box; transform-origin: 50% 100%; animation: hk-wobble 2.6s ease-in-out infinite; }
.hk-drift { animation: hk-drift 50s linear infinite; }
.hk-drift-slow { animation: hk-drift 80s linear infinite; }
@keyframes hk-sail {
  0%   { transform: translate(450px, 166px); }
  100% { transform: translate(-60px, 166px); }
}
@keyframes hk-bob { 0%, 100% { transform: rotate(-2deg) translateY(0); } 50% { transform: rotate(2deg) translateY(.8px); } }
@keyframes hk-steam {
  0%   { transform: translateY(0) scale(.6, .8); opacity: 0; }
  20%  { opacity: .85; }
  100% { transform: translateY(-22px) scale(1.3, 1.1); opacity: 0; }
}
@keyframes hk-shimmer {
  0%, 100% { transform: translateX(0); opacity: .25; }
  50% { transform: translateX(4px); opacity: .9; }
}
@keyframes hk-wobble { 0%, 100% { transform: skewX(-2deg) scaleY(1); } 50% { transform: skewX(2deg) scaleY(.96); } }
@keyframes hk-drift { from { transform: translateX(0); } to { transform: translateX(-400px); } }
@media (prefers-reduced-motion: reduce) {
  .hk-ship, .hk-bob, .hk-steam, .hk-shimmer, .hk-wobble, .hk-drift, .hk-drift-slow { animation: none; }
  .hk-ship { transform: translate(262px, 166px); }
  .hk-steam { opacity: .55; }
  .hk-shimmer { opacity: .6; }
}
`

const SHIMMER = [
  [70, 134, 10], [160, 138, 14], [250, 135, 12], [340, 140, 10], [120, 150, 16], [210, 156, 12],
  [300, 152, 14], [60, 168, 12], [180, 178, 18], [280, 182, 14], [360, 172, 12], [110, 190, 16],
]

function Fuji() {
  return (
    <g>
      <path d="M116 130 Q170 102 208 72 Q214 66 222 67 Q230 66 236 72 Q278 102 334 130 Z" fill="url(#hk-fuji)" />
      <path d="M208 72 Q214 66 222 67 Q230 66 236 72 Q248 82 258 88 L250 86 L244 92 L236 86 L228 94 L220 86 L212 93 L204 86 L196 91 L188 88 Q199 80 208 72 Z" fill="#fbfcff" />
      <path d="M222 67 Q230 66 236 72 Q248 82 258 88 L250 86 L244 92 L236 86 L230 92 Q232 80 222 67 Z" fill="#c9d6f5" />
    </g>
  )
}

function Torii() {
  return (
    <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
      <rect x="85.5" y="100" width="5.5" height="46" fill="#e2412f" />
      <rect x="109" y="100" width="5.5" height="46" fill="#e2412f" />
      <rect x="81" y="110" width="38" height="4" fill="#e2412f" />
      <rect x="96.5" y="103" width="7" height="7" fill="#2b2445" />
      <path d="M78 101 L122 101 L122 104.5 L78 104.5 Z" fill="#e2412f" />
      <path d="M71 94 Q100 100.5 129 94 L128 98.5 Q100 104.5 72 98.5 Z" fill="#e2412f" />
      <path d="M70 91.5 Q100 98 130 91.5 L129 94.5 Q100 100.5 71 94.5 Z" fill={INK} />
      <path d="M85.5 141 H91 M109 141 H114.5" stroke="#2b2445" strokeWidth="3" />
    </g>
  )
}

export default function HakoneScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="hk-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f6fd0" />
          <stop offset=".35" stopColor="#6aaef0" />
          <stop offset=".55" stopColor="#bfe0fb" />
          <stop offset=".65" stopColor="#ffe6cf" />
        </linearGradient>
        <radialGradient id="hk-sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset=".4" stopColor="#fff1c2" stopOpacity=".8" />
          <stop offset="1" stopColor="#fff1c2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hk-fuji" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6b78c9" />
          <stop offset="1" stopColor="#3b3f8f" />
        </linearGradient>
        <linearGradient id="hk-lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd0f2" />
          <stop offset=".35" stopColor="#4c9bd8" />
          <stop offset="1" stopColor="#1f4f92" />
        </linearGradient>
        <linearGradient id="hk-hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c0453a" />
          <stop offset="1" stopColor="#7a2430" />
        </linearGradient>
        <clipPath id="hk-water">
          <rect y="128" width="400" height="72" />
        </clipPath>
      </defs>

      <rect width="400" height="200" fill="url(#hk-sky)" />
      <circle cx="84" cy="70" r="34" fill="url(#hk-sun)" />
      <circle cx="84" cy="70" r="9" fill="#fffbe6" />

      {/* Clouds drifting at two speeds */}
      <g className="hk-drift-slow" opacity=".85">
        {[0, 400].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`} fill="#ffffff">
            <ellipse cx="150" cy="58" rx="40" ry="6" />
            <ellipse cx="330" cy="66" rx="34" ry="5" />
          </g>
        ))}
      </g>

      <Fuji />

      <g className="hk-drift" opacity=".9">
        {[0, 400].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`} fill="#f4f8ff">
            <ellipse cx="60" cy="96" rx="34" ry="4" />
            <ellipse cx="250" cy="100" rx="44" ry="4.5" />
          </g>
        ))}
      </g>

      {/* Hillsides: forest on the left, hot spring slope on the right */}
      <path d="M270 128 Q300 108 340 104 Q372 100 400 96 L400 132 L270 132 Z" fill="#3f8a63" />
      <path d="M296 120 Q330 108 400 104 L400 132 L290 132 Z" fill="#2f7253" />
      <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
        <rect x="314" y="113" width="16" height="7" fill="#f3e6d2" />
        <path d="M311 114 L322 108 L333 114 Z" fill="#7a3b4a" />
      </g>
      {[[310, 110, 0], [324, 107, 1.5], [338, 106, 3]].map(([x, y, d], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M0 0 Q-4 -5 0 -10 T0 -20" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" className="hk-steam" style={{ animationDelay: `${d}s` }} />
        </g>
      ))}
      <path d="M0 122 Q34 108 72 114 Q110 118 150 132 L0 132 Z" fill="#2f7253" />
      <g fill="#3f8a63">
        <circle cx="20" cy="118" r="8" />
        <circle cx="44" cy="113" r="9" />
        <circle cx="70" cy="115" r="8" />
        <circle cx="96" cy="120" r="7" />
        <circle cx="120" cy="126" r="6" />
      </g>

      {/* The lake with mirrored mountain and torii */}
      <rect y="128" width="400" height="72" fill="url(#hk-lake)" />
      <path d="M0 128 H400" stroke="#d8f1ff" strokeWidth="1" opacity=".7" />
      <g clipPath="url(#hk-water)">
        <g transform="translate(0 260) scale(1 -1)" opacity=".28">
          <Fuji />
        </g>
        <g transform="translate(0 292) scale(1 -1)" opacity=".35">
          <g className="hk-wobble">
            <Torii />
          </g>
        </g>
      </g>
      {SHIMMER.map(([x, y, w], i) => (
        <path key={i} d={`M${x} ${y} h${w}`} stroke="#e8f8ff" strokeWidth="1.2" strokeLinecap="round" className="hk-shimmer" style={{ animationDelay: `${-((i * 0.53) % 3)}s` }} />
      ))}

      <Torii />
      <g stroke="#e8f8ff" strokeWidth="1" fill="none" opacity=".8">
        <ellipse cx="88.2" cy="146.5" rx="6" ry="1.4" />
        <ellipse cx="111.8" cy="146.5" rx="6" ry="1.4" />
      </g>

      {/* The sailing ship gliding across, bow first */}
      <g className="hk-ship">
        <g transform="scale(.85)">
          <path d="M-30 9 Q0 15 34 9 Q0 21 -30 9 Z" fill="#163a72" opacity=".35" />
          <path d="M34 2 h14 M38 6 h10" stroke="#e8f8ff" strokeWidth="1.2" strokeLinecap="round" opacity=".8" />
          <g className="hk-bob">
            <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
              <path d="M-8 -4 V-42 M10 -4 V-38" />
              <path d="M-32 -10 L-44 -17" />
              <path d="M-19 -36 Q-8 -32 3 -36 L3 -18 Q-8 -14 -19 -18 Z" fill="#fff6e4" />
              <path d="M0 -32 Q10 -28 20 -32 L20 -16 Q10 -12 0 -16 Z" fill="#fff6e4" />
              <path d="M-32 -10 L-22 -4 L18 -4 L18 -14 L32 -14 L34 -10 L30 6 L-20 6 Q-28 2 -32 -10 Z" fill="url(#hk-hull)" />
              <path d="M-8 -42 L-1 -40 L-8 -38 Z M10 -38 L17 -36 L10 -34 Z" fill="#ffcc3d" strokeWidth="1.2" />
            </g>
            <path d="M-26 -3 H31" stroke="#ffcc3d" strokeWidth="1.4" />
            <path d="M18 -10 H33" stroke="#ffcc3d" strokeWidth="1.2" />
            {[-14, -4, 6, 16].map((x) => (
              <circle key={x} cx={x} cy="1" r="1.2" fill="#ffe7a0" />
            ))}
          </g>
        </g>
      </g>
    </svg>
  )
}
