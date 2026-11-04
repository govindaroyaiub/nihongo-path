// Akihabara at night: stacked neon signs buzz and flicker over the electric
// town while a yellow-green commuter train rattles across the rail bridge.
const INK = '#261e3e'

const CSS = `
.ak-train { animation: ak-train 9s linear infinite; }
.ak-flick-a { animation: ak-flick-a 4.2s steps(1) infinite; }
.ak-flick-b { animation: ak-flick-b 6.5s steps(1) infinite; }
.ak-flick-c { animation: ak-flick-c 3.1s ease-in-out infinite; }
.ak-rain { animation: ak-rain 1.4s linear infinite; }
.ak-twinkle { animation: ak-twinkle 3s ease-in-out infinite; }
.ak-shimmer { animation: ak-shimmer 2.2s ease-in-out infinite alternate; }
@keyframes ak-train {
  0% { transform: translateX(430px); }
  58%, 100% { transform: translateX(-250px); }
}
@keyframes ak-flick-a { 0%, 100% { opacity: 1; } 40% { opacity: .25; } 42% { opacity: 1; } 45% { opacity: .4; } 47% { opacity: 1; } }
@keyframes ak-flick-b { 0%, 100% { opacity: 1; } 70% { opacity: .2; } 71% { opacity: 1; } 72% { opacity: .2; } 76% { opacity: 1; } }
@keyframes ak-flick-c { 0%, 100% { opacity: 1; } 50% { opacity: .65; } }
@keyframes ak-rain { from { transform: translate(0, 0); } to { transform: translate(-40px, 160px); } }
@keyframes ak-twinkle { 0%, 100% { opacity: .9; } 50% { opacity: .25; } }
@keyframes ak-shimmer { from { opacity: .15; } to { opacity: .4; } }
@media (prefers-reduced-motion: reduce) {
  .ak-train, .ak-flick-a, .ak-flick-b, .ak-flick-c, .ak-rain, .ak-twinkle, .ak-shimmer { animation: none; }
  .ak-shimmer { opacity: .3; }
}
`

// Vertical neon signs: x, y, colour, text, flicker class, delay
const SIGNS = [
  { x: 58, y: 56, color: '#ff4fa3', chars: 'アキバ', cls: 'ak-flick-a', delay: 0 },
  { x: 84, y: 64, color: '#4fe3ff', chars: '電気', cls: 'ak-flick-c', delay: 0.8 },
  { x: 298, y: 54, color: '#ffe24f', chars: 'ゲーム', cls: 'ak-flick-b', delay: 0 },
  { x: 324, y: 62, color: '#5dff9a', chars: 'アニメ', cls: 'ak-flick-a', delay: 1.9 },
]

// Shop fronts under the bridge: x, width, glow colour, awning colour
const SHOPS = [
  [40, 46, '#ffe9a8', '#ff4fa3'],
  [134, 54, '#bff6ff', '#4fe3ff'],
  [212, 50, '#ffd6f0', '#ffe24f'],
  [290, 60, '#d6ffe6', '#5dff9a'],
]

// Rain streaks across a 480-wide tile so the diagonal loop never shows a gap
const DROPS = Array.from({ length: 46 }, (_, i) => [((i * 53) % 480) - 20, 40 + ((i * 37) % 160)])

const WINDOWS = [
  [150, 100], [160, 108], [170, 100], [230, 100], [240, 108], [250, 100], [18, 70], [26, 86], [372, 66], [380, 84],
]

function Sign({ x, y, color, chars, cls, delay }) {
  const w = 18
  const h = chars.length * 14 + 6
  return (
    <g className={cls} style={{ animationDelay: `${delay}s` }}>
      <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx="5" fill={color} opacity=".22" />
      <rect x={x} y={y} width={w} height={h} rx="2" fill="#1a1236" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} rx="1.5" fill="none" stroke={color} strokeWidth=".8" opacity=".8" />
      {[...chars].map((ch, i) =>
        ch === 'ー' ? (
          <rect key={i} x={x + w / 2 - 1.3} y={y + 6 + i * 14} width="2.6" height="9" rx="1" fill="#fff8fc" stroke={color} strokeWidth="1.2" paintOrder="stroke" />
        ) : (
          <text key={i} x={x + w / 2} y={y + 15.5 + i * 14} textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="11" fill="#fff8fc" stroke={color} strokeWidth="2" paintOrder="stroke">
            {ch}
          </text>
        ),
      )}
    </g>
  )
}

export default function AkihabaraScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="ak-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b0926" />
          <stop offset=".45" stopColor="#2c1758" />
          <stop offset=".75" stopColor="#6a2a7a" />
          <stop offset="1" stopColor="#a83a7e" />
        </linearGradient>
        <linearGradient id="ak-street" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2148" />
          <stop offset="1" stopColor="#150f2b" />
        </linearGradient>
        <linearGradient id="ak-under" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120c28" />
          <stop offset="1" stopColor="#3a2560" />
        </linearGradient>
        <linearGradient id="ak-car" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f6fa" />
          <stop offset="1" stopColor="#b9bfcc" />
        </linearGradient>
        <linearGradient id="ak-drop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe6ff" stopOpacity="0" />
          <stop offset="1" stopColor="#cfe6ff" stopOpacity=".7" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#ak-sky)" />

      {/* Far skyline */}
      <path d="M0 100 H20 V80 H44 V92 H130 V72 H150 V60 H250 V74 H272 V90 H360 V76 H400 V150 H0 Z" fill="#1d1740" />
      {WINDOWS.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="3" fill="#ffd98a" className="ak-twinkle" style={{ animationDelay: `${(i * 0.61) % 3}s` }} />
      ))}

      {/* Centre building with a horizontal 電気街 sign */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="150" y="64" width="100" height="70" fill="#2b2354" />
        <rect x="160" y="70" width="80" height="20" rx="2" fill="#2a1030" />
      </g>
      <g className="ak-flick-c" style={{ animationDelay: '1.4s' }}>
        <rect x="156" y="66" width="88" height="28" rx="4" fill="#ff8a3d" opacity=".2" />
        <rect x="162" y="72" width="76" height="16" rx="1.5" fill="none" stroke="#ff8a3d" strokeWidth=".8" />
        <text x="200" y="85" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="12" fill="#fff4e8" stroke="#ff8a3d" strokeWidth="2" paintOrder="stroke">
          電気街
        </text>
      </g>

      {/* Side buildings carrying the vertical signs */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="34" y="46" width="88" height="110" fill="#2e2758" />
        <rect x="282" y="44" width="80" height="112" fill="#2e2758" />
      </g>
      {[[40, 112], [52, 112], [108, 112], [288, 108], [348, 108], [348, 96]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="5" height="4" fill="#ffd98a" className="ak-twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
      {SIGNS.map((s) => (
        <Sign key={s.chars} {...s} />
      ))}

      {/* Under the bridge: dark street with glowing shop fronts */}
      <rect y="140" width="400" height="48" fill="url(#ak-under)" />
      {SHOPS.map(([x, w, glow, awning], i) => (
        <g key={x}>
          <rect x={x - 6} y="148" width={w + 12} height="40" fill={glow} opacity=".15" />
          <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
            <rect x={x} y="156" width={w} height="30" fill={glow} />
            <path d={`M${x - 3} 150 H${x + w + 3} L${x + w} 157 H${x} Z`} fill={awning} />
            <path d={`M${x + w / 3} 160 V186 M${x + (2 * w) / 3} 160 V186`} strokeWidth="1" opacity=".5" />
          </g>
          <rect x={x + 4} y="166" width={w / 3 - 8} height="6" rx="1" fill={awning} opacity=".7" className="ak-flick-c" style={{ animationDelay: `${i * 0.7}s` }} />
        </g>
      ))}

      {/* Wet street with neon reflections */}
      <rect y="186" width="400" height="14" fill="url(#ak-street)" />
      {SIGNS.map((s) => (
        <ellipse key={s.chars} cx={s.x + 9} cy="194" rx="2.6" ry="6" fill={s.color} className="ak-shimmer" style={{ animationDelay: `${s.delay}s` }} />
      ))}
      <path d="M0 186.5 H400" stroke={INK} strokeWidth="1.4" />

      {/* Elevated rail bridge */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        {[18, 118, 196, 276, 368].map((x) => (
          <rect key={x} x={x} y="140" width="10" height="47" fill="#3e3868" />
        ))}
        <rect x="-10" y="128" width="420" height="13" fill="#4a4478" />
        <path d="M-10 128 H410" strokeWidth="1.8" />
      </g>
      <path
        d={Array.from({ length: 21 }, (_, i) => `M${i * 20 - 10} 140 L${i * 20 + 10} 129`).join(' ')}
        stroke="#6d66a0"
        strokeWidth="1.2"
      />
      <path d="M-10 124 H410" stroke={INK} strokeWidth="1" opacity=".6" />

      {/* Commuter train rolling right to left */}
      <g className="ak-train" transform="translate(100 0)">
        <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
          <path d="M0 128 L0 115 Q0 110 6 110 L70 110 L70 128 Z" fill="url(#ak-car)" />
          <rect x="72" y="110" width="70" height="18" fill="url(#ak-car)" />
          <path d="M144 110 L208 110 Q214 110 214 115 L214 128 L144 128 Z" fill="url(#ak-car)" />
          <rect x="22" y="106.5" width="14" height="3.5" fill="#9aa1b4" strokeWidth="1" />
          <rect x="96" y="106.5" width="14" height="3.5" fill="#9aa1b4" strokeWidth="1" />
          <rect x="168" y="106.5" width="14" height="3.5" fill="#9aa1b4" strokeWidth="1" />
        </g>
        <path d="M1 121.5 H213" stroke="#b8d630" strokeWidth="3" />
        {[0, 72, 144].map((cx) =>
          [8, 20, 32, 44, 56].map((dx) => (
            <rect key={cx + dx} x={cx + dx} y="113" width="7" height="5.5" rx=".8" fill="#ffe9a8" />
          )),
        )}
        <path d="M2 113 L5 113 L5 118.5 L2 118.5 Z" fill="#33477e" />
        <circle cx="3" cy="125.5" r="1.2" fill="#fff6c8" />
      </g>

      {/* Light rain over everything */}
      <g className="ak-rain" opacity=".55">
        {[[0, 0], [40, -160]].map(([dx, dy]) => (
          <g key={dy} transform={`translate(${dx} ${dy})`}>
            {DROPS.map(([x, y], i) => (
              <path key={i} d={`M${x} ${y} l-2 8`} stroke="url(#ak-drop)" strokeWidth="0.9" strokeLinecap="round" />
            ))}
          </g>
        ))}
      </g>
    </svg>
  )
}
