// Nagoya Castle at a spring sunset: golden roof fish glint on the ridge,
// cherry trees shed petals, and the moat mirrors it all.
const INK = '#261e3e'

const CSS = `
.ng-star { transform-box: fill-box; transform-origin: center; animation: ng-star 3.2s ease-in-out infinite; }
.ng-halo { transform-box: fill-box; transform-origin: center; animation: ng-halo 3.2s ease-in-out infinite; }
.ng-shine { animation: ng-shine 3.2s ease-in-out infinite; }
.ng-petal { transform-box: fill-box; transform-origin: center; animation: ng-fall 9s linear infinite; }
.ng-sway { transform-box: fill-box; transform-origin: 50% 100%; animation: ng-sway 6s ease-in-out infinite; }
.ng-ripple { animation: ng-ripple 3.4s ease-in-out infinite; }
.ng-drift { animation: ng-drift 70s linear infinite; }
@keyframes ng-star {
  0%, 55%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
  70% { transform: scale(1.2) rotate(45deg); opacity: 1; }
  85% { transform: scale(.4) rotate(90deg); opacity: .6; }
}
@keyframes ng-halo {
  0%, 50%, 100% { transform: scale(.6); opacity: .25; }
  70% { transform: scale(1.15); opacity: .95; }
}
@keyframes ng-shine { 0%, 55%, 100% { opacity: 0; } 70% { opacity: 1; } }
@keyframes ng-fall {
  0%   { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  8%   { opacity: 1; }
  25%  { transform: translate(-12px, 38px) rotate(90deg); }
  50%  { transform: translate(-4px, 76px) rotate(180deg); }
  75%  { transform: translate(-22px, 114px) rotate(270deg); }
  92%  { opacity: 1; }
  100% { transform: translate(-30px, 152px) rotate(360deg); opacity: 0; }
}
@keyframes ng-sway { 0%, 100% { transform: rotate(-1.2deg); } 50% { transform: rotate(1.2deg); } }
@keyframes ng-ripple { 0%, 100% { transform: translateX(0); opacity: .3; } 50% { transform: translateX(-5px); opacity: .9; } }
@keyframes ng-drift { from { transform: translateX(0); } to { transform: translateX(-400px); } }
@media (prefers-reduced-motion: reduce) {
  .ng-star, .ng-halo, .ng-shine, .ng-petal, .ng-sway, .ng-ripple, .ng-drift { animation: none; }
  .ng-star { transform: scale(.8); opacity: .9; }
  .ng-halo { opacity: .6; }
  .ng-shine { opacity: .7; }
  .ng-petal { transform: translate(var(--ng-x), var(--ng-y)) rotate(30deg); }
  .ng-ripple { opacity: .6; }
}
`

const PETALS = Array.from({ length: 20 }, (_, i) => ({
  x: 60 + ((i * 67) % 340),
  dur: 7 + ((i * 13) % 5),
  delay: -((i * 1.37) % 11),
  fill: i % 3 ? '#ffc4d8' : '#ffe3ec',
  rx: (12 - (i % 3) * 7),
  ry: 30 + ((i * 41) % 110),
}))

const MOAT = [[70, 182, 14], [140, 186, 18], [230, 183, 16], [310, 188, 14], [100, 194, 12], [270, 195, 16], [190, 192, 14]]

// Blossom clouds: drawn twice (thick ink pass, then fill pass) so only the outer edge is outlined.
const LEFT_BLOOM = [[52, 112, 16], [76, 100, 18], [100, 110, 15], [64, 132, 15], [92, 130, 16], [116, 124, 12], [40, 128, 13]]
const RIGHT_BLOOM = LEFT_BLOOM.map(([x, y, r]) => [400 - x, y + 4, r])

function Fish({ x, flip }) {
  return (
    <g transform={`translate(${x} 73) scale(${flip ? -1 : 1} 1)`}>
      <path d="M-3.5 0 Q-5 -4 -2 -7 Q.5 -9 -.5 -10.5 L-3.5 -12.5 L.8 -11.6 L3.4 -13.4 L3 -9.5 Q4.6 -6 3.6 -2.5 Q3.2 0 -3.5 0 Z" fill="url(#ng-gold)" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="-2" cy="-2" r=".7" fill={INK} />
      <path d="M0 -3 Q1.6 -6 .6 -8.5" stroke="#fff8d0" strokeWidth=".9" fill="none" strokeLinecap="round" className="ng-shine" style={{ animationDelay: flip ? '1.6s' : '0s' }} />
    </g>
  )
}

function Castle() {
  return (
    <g>
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        {/* stone base */}
        <path d="M136 178 Q146 164 150 150 L250 150 Q254 164 264 178 Z" fill="url(#ng-stone)" />
        {/* tier 1 */}
        <rect x="158" y="134" width="84" height="16" fill="#fbf4ec" />
        <rect x="166" y="114" width="68" height="14" fill="#fbf4ec" />
        <path d="M146 137 Q152 134 160 128 L240 128 Q248 134 254 137 Q200 133 146 137 Z" fill="url(#ng-roof)" />
        {/* tier 3 */}
        <rect x="174" y="96" width="52" height="12" fill="#fbf4ec" />
        <path d="M156 116 Q162 113 170 108 L230 108 Q238 113 244 116 Q200 112 156 116 Z" fill="url(#ng-roof)" />
        <path d="M186 111 L200 100 L214 111 Z" fill="url(#ng-roof)" />
        <path d="M192 109.5 L200 103.5 L208 109.5 Z" fill="#fbf4ec" strokeWidth="1" />
        {/* tier 4 and the top roof */}
        <rect x="182" y="80" width="36" height="9" fill="#fbf4ec" />
        <path d="M164 98 Q170 94 178 89 L222 89 Q230 94 236 98 Q200 94 164 98 Z" fill="url(#ng-roof)" />
        <path d="M188 93 Q200 84 212 93" fill="none" strokeWidth="1.4" />
        <path d="M172 82 Q178 78 186 73 L214 73 Q222 78 228 82 Q200 79 172 82 Z" fill="url(#ng-roof)" />
      </g>
      {/* stone courses */}
      <g stroke={INK} strokeWidth=".8" opacity=".45">
        <path d="M147 158 H253 M143 165 H257 M140 172 H260" />
      </g>
      {/* windows */}
      <g fill="#3a2f55">
        {[166, 178, 190, 204, 216, 228].map((x) => <rect key={x} x={x} y="140" width="5" height="4" />)}
        {[174, 186, 210, 222].map((x) => <rect key={x} x={x} y="119" width="4.5" height="4" />)}
        {[181, 193, 203, 215].map((x) => <rect key={x} x={x} y="100" width="4" height="3.5" />)}
        {[188, 197, 206].map((x) => <rect key={x} x={x} y="83" width="4" height="3" />)}
      </g>
      <g stroke="#b9f0dc" strokeWidth="1" opacity=".7" fill="none">
        <path d="M156 133.5 Q170 130.5 184 130" />
        <path d="M166 112.5 Q176 110 186 109.6" />
        <path d="M174 94.8 Q182 92 190 91" />
        <path d="M180 78.6 Q186 76 192 75.2" />
      </g>
      <Fish x={186.5} />
      <Fish x={213.5} flip />
    </g>
  )
}

function Bloom({ circles }) {
  return (
    <g>
      <g fill="#ffb3cc" stroke={INK} strokeWidth="3.2">
        {circles.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
      </g>
      <g fill="#ffb3cc">
        {circles.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
      </g>
      <g fill="#ffd9e6">
        {circles.map(([x, y, r], i) => <circle key={i} cx={x - r * 0.25} cy={y - r * 0.3} r={r * 0.5} />)}
      </g>
    </g>
  )
}

export default function NagoyaScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="ng-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#35286a" />
          <stop offset=".32" stopColor="#9a4588" />
          <stop offset=".52" stopColor="#ff6f78" />
          <stop offset=".66" stopColor="#ffa864" />
          <stop offset=".78" stopColor="#ffde98" />
        </linearGradient>
        <radialGradient id="ng-sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset=".35" stopColor="#ffd27a" stopOpacity=".85" />
          <stop offset="1" stopColor="#ff9a5a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ng-glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff6c0" stopOpacity=".95" />
          <stop offset="1" stopColor="#ffd84a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ng-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff2a0" />
          <stop offset=".5" stopColor="#ffc928" />
          <stop offset="1" stopColor="#c98a12" />
        </linearGradient>
        <linearGradient id="ng-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fc2a6" />
          <stop offset="1" stopColor="#2f7f72" />
        </linearGradient>
        <linearGradient id="ng-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a49ab8" />
          <stop offset="1" stopColor="#6c6288" />
        </linearGradient>
        <linearGradient id="ng-moat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a86" />
          <stop offset="1" stopColor="#5a3a7e" />
        </linearGradient>
        <clipPath id="ng-water">
          <rect y="178" width="400" height="22" />
        </clipPath>
      </defs>

      <rect width="400" height="200" fill="url(#ng-sky)" />
      <circle cx="292" cy="136" r="50" fill="url(#ng-sun)" />
      <circle cx="292" cy="136" r="14" fill="#fff3c4" />

      <g className="ng-drift" opacity=".6">
        {[0, 400].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`} fill="#ffb0b8">
            <ellipse cx="80" cy="66" rx="50" ry="5" />
            <ellipse cx="290" cy="80" rx="58" ry="5" />
            <ellipse cx="190" cy="104" rx="36" ry="3.5" />
          </g>
        ))}
      </g>

      {/* Far hills and city haze */}
      <path d="M0 150 Q50 138 100 146 T200 142 T300 146 T400 140 L400 180 L0 180 Z" fill="#6a3f7e" />

      {/* Grassy banks along the moat */}
      <path d="M0 168 Q80 164 150 168 L150 180 L0 180 Z M250 168 Q320 164 400 168 L400 180 L250 180 Z" fill="#4f6e5a" />

      {/* Glow behind the golden fish */}
      <circle cx="186.5" cy="66" r="10" fill="url(#ng-glow)" className="ng-halo" />
      <circle cx="213.5" cy="66" r="10" fill="url(#ng-glow)" className="ng-halo" style={{ animationDelay: '1.6s' }} />

      <Castle />

      {/* Moat with the castle's reflection */}
      <rect y="178" width="400" height="22" fill="url(#ng-moat)" />
      <g clipPath="url(#ng-water)">
        <g transform="translate(0 356) scale(1 -1)" opacity=".35">
          <Castle />
        </g>
      </g>
      <path d="M0 178 H400" stroke="#ffd9c8" strokeWidth="1" opacity=".7" />
      {MOAT.map(([x, y, w], i) => (
        <path key={i} d={`M${x} ${y} h${w}`} stroke="#ffe6d6" strokeWidth="1.1" strokeLinecap="round" className="ng-ripple" style={{ animationDelay: `${-((i * 0.61) % 3.4)}s` }} />
      ))}

      {/* Sparkles on the golden fish */}
      {[[186, 61, '0s'], [214, 61, '1.6s']].map(([x, y, d]) => (
        <path key={x} d={`M${x} ${y - 6} L${x + 1.3} ${y - 1.3} L${x + 6} ${y} L${x + 1.3} ${y + 1.3} L${x} ${y + 6} L${x - 1.3} ${y + 1.3} L${x - 6} ${y} L${x - 1.3} ${y - 1.3} Z`} fill="#fffbe0" className="ng-star" style={{ animationDelay: d }} />
      ))}

      {/* Cherry trees framing the castle */}
      <g className="ng-sway">
        <path d="M70 200 Q74 170 78 150 Q70 136 58 128 M78 150 Q90 136 100 124 M76 160 Q96 150 112 140" stroke={INK} strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M70 200 Q74 170 78 150 Q70 136 58 128 M78 150 Q90 136 100 124 M76 160 Q96 150 112 140" stroke="#5a3a4a" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        <Bloom circles={LEFT_BLOOM} />
      </g>
      <g className="ng-sway" style={{ animationDelay: '-3s' }}>
        <path d="M330 200 Q326 170 322 154 Q330 140 342 132 M322 154 Q310 140 300 128 M324 164 Q304 154 288 144" stroke={INK} strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M330 200 Q326 170 322 154 Q330 140 342 132 M322 154 Q310 140 300 128 M324 164 Q304 154 288 144" stroke="#5a3a4a" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        <Bloom circles={RIGHT_BLOOM} />
      </g>

      {/* Falling petals */}
      {PETALS.map((p, i) => (
        <g key={i} transform={`translate(${p.x} 46)`}>
          <ellipse
            rx="2.4"
            ry="1.4"
            fill={p.fill}
            stroke="#e0789e"
            strokeWidth=".5"
            className="ng-petal"
            style={{ animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, '--ng-x': `${p.rx}px`, '--ng-y': `${p.ry}px` }}
          />
        </g>
      ))}
    </svg>
  )
}
