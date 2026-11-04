// Osaka canal street at night: neon signs shimmer in the water, a giant crab
// sign waves its legs, steam rises from a takoyaki stall and a tour boat glides by.
const INK = '#261e3e'

const CSS = `
.os-leg { transform-box: view-box; transform-origin: 0 0; animation: os-leg .9s ease-in-out infinite alternate; }
.os-claw { transform-box: view-box; transform-origin: 0 0; animation: os-claw 2.4s ease-in-out infinite; }
.os-jaw { transform-box: view-box; transform-origin: 0 0; animation: os-jaw 1.2s ease-in-out infinite; }
.os-eye { transform-box: fill-box; transform-origin: 50% 100%; animation: os-eye 1.8s ease-in-out infinite alternate; }
.os-flicker { animation: os-flicker 4s steps(1) infinite; }
.os-pulse { animation: os-pulse 2.4s ease-in-out infinite; }
.os-chase { animation: os-chase 1.2s linear infinite; }
.os-shimmer { transform-box: fill-box; transform-origin: center; animation: os-shimmer 1.8s ease-in-out infinite; }
.os-ripple { animation: os-ripple 5s linear infinite; }
.os-boat { animation: os-boat 20s linear infinite; }
.os-bob { animation: os-bob 2.2s ease-in-out infinite; }
.os-steam { transform-box: fill-box; transform-origin: center; animation: os-steam 3s ease-out infinite; }
.os-twinkle { animation: os-twinkle 3s ease-in-out infinite; }
@keyframes os-leg { from { transform: rotate(-14deg); } to { transform: rotate(14deg); } }
@keyframes os-claw { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-16deg); } }
@keyframes os-jaw { 0%, 45%, 100% { transform: rotate(0deg); } 20% { transform: rotate(-28deg); } }
@keyframes os-eye { from { transform: rotate(-8deg); } to { transform: rotate(8deg); } }
@keyframes os-flicker { 0%, 100% { opacity: 1; } 42% { opacity: .25; } 44% { opacity: 1; } 46% { opacity: .35; } 48% { opacity: 1; } }
@keyframes os-pulse { 0%, 100% { opacity: .75; } 50% { opacity: 1; } }
@keyframes os-chase { 0% { opacity: 1; } 30%, 100% { opacity: .2; } }
@keyframes os-shimmer {
  0%, 100% { transform: scaleX(1) translateX(0); opacity: .75; }
  50% { transform: scaleX(.6) translateX(2px); opacity: .4; }
}
@keyframes os-ripple { from { transform: translateX(0); } to { transform: translateX(-40px); } }
@keyframes os-boat { from { transform: translateX(-90px); } to { transform: translateX(480px); } }
@keyframes os-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(1.3px); } }
@keyframes os-steam {
  0% { transform: translate(0, 0) scale(.5); opacity: 0; }
  20% { opacity: .7; }
  100% { transform: translate(4px, -26px) scale(1.7); opacity: 0; }
}
@keyframes os-twinkle { 0%, 100% { opacity: .8; } 50% { opacity: .2; } }
@media (prefers-reduced-motion: reduce) {
  .os-leg, .os-claw, .os-jaw, .os-eye, .os-flicker, .os-pulse, .os-chase, .os-shimmer, .os-ripple, .os-boat, .os-bob, .os-steam, .os-twinkle { animation: none; }
  .os-boat { transform: translateX(250px); }
  .os-steam { opacity: .4; }
}
`

const STARS = [[30, 46], [96, 52], [180, 44], [236, 50], [350, 46], [384, 58]]

// Far skyline blocks: x, width, top
const FAR = [[0, 30, 62], [28, 24, 50], [54, 34, 66], [86, 22, 44], [110, 40, 60], [150, 26, 48], [178, 36, 64], [216, 24, 46], [242, 30, 58], [274, 22, 42], [298, 36, 60], [334, 26, 50], [362, 40, 64]]

// Front row along the canal: x, width, top, colour
const FRONT = [[-2, 98, 70, '#2a2150'], [96, 94, 58, '#33275c'], [190, 76, 78, '#2a2150'], [266, 64, 54, '#33275c'], [330, 72, 72, '#2a2150']]

// Neon reflections in the canal: centre x, width, colour
const REFL = [[74, 16, '#ffd23e'], [143, 34, '#ff4a3d'], [228, 44, '#ff5fb4'], [298, 16, '#3ef0ff'], [350, 12, '#9b7bff'], [110, 6, '#ffb36b']]

// Left half of the crab; the right half is the same group mirrored.
function CrabHalf({ offset }) {
  const legs = [[124, 99], [126, 103.5], [129.5, 107.5]]
  return (
    <g>
      {legs.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className="os-leg" style={{ animationDelay: `${offset - i * 0.3}s` }}>
            <path d="M0 0 Q-9 -5 -15 2 L-18 11" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0 0 Q-9 -5 -15 2 L-18 11" fill="none" stroke="#ff4a3d" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      ))}
      <g transform="translate(124 93)">
        <g className="os-claw" style={{ animationDelay: `${offset}s` }}>
          <path d="M0 0 Q-8 -5 -12 -13" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
          <path d="M0 0 Q-8 -5 -12 -13" fill="none" stroke="#ff4a3d" strokeWidth="3.4" strokeLinecap="round" />
          <g stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
            <path d="M-20 -16 Q-29 -18 -28 -28 Q-22 -22 -17 -21 Z" fill="#ff4a3d" />
            <ellipse cx="-14" cy="-17" rx="7" ry="5.5" transform="rotate(-30 -14 -17)" fill="#ff4a3d" />
            <g transform="translate(-17 -21.5)">
              <g className="os-jaw" style={{ animationDelay: `${offset * 0.5}s` }}>
                <path d="M0 0 Q-2 -8 2 -12 Q4 -6 4 -1 Z" fill="#ff6a50" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  )
}

export default function OsakaScene() {
  return (
    <svg viewBox="0 40 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden>
      <style>{CSS}</style>
      <defs>
        <linearGradient id="os-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e0b2a" />
          <stop offset=".45" stopColor="#2a1650" />
          <stop offset=".72" stopColor="#6a2470" />
        </linearGradient>
        <linearGradient id="os-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24174a" />
          <stop offset="1" stopColor="#0b0920" />
        </linearGradient>
        <filter id="os-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="400" height="200" fill="url(#os-sky)" />
      {STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r=".9" fill="#fff" className="os-twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}

      {/* Far skyline with scattered lit windows */}
      {FAR.map(([x, w, top]) => (
        <g key={x}>
          <rect x={x} y={top} width={w} height={100} fill="#1c1538" />
          {Array.from({ length: 4 }, (_, j) => (
            <rect key={j} x={x + 4 + (j % 2) * (w - 12)} y={top + 6 + j * 9} width="4" height="3" fill="#ffd98a" opacity=".45" />
          ))}
        </g>
      ))}

      {/* Front row of buildings along the canal */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        {FRONT.map(([x, w, top, c]) => (
          <rect key={x} x={x} y={top} width={w} height={150 - top} fill={c} />
        ))}
      </g>
      {FRONT.map(([x, w, top]) =>
        Array.from({ length: 3 }, (_, j) => (
          <path key={`${x}-${j}`} d={`M${x + 6} ${top + 12 + j * 18} H${x + w - 6}`} stroke="#ffb36b" strokeWidth="2" strokeDasharray="4 5" opacity=".35" />
        )),
      )}

      {/* Marquee bulbs along the crab building */}
      {Array.from({ length: 11 }, (_, i) => (
        <circle key={i} cx={102 + i * 8.2} cy="63" r="1.6" fill="#fff3a8" className="os-chase" style={{ animationDelay: `${(i * 0.11).toFixed(2)}s` }} />
      ))}

      {/* Generic neon: ring with a star, and an arrow */}
      <g filter="url(#os-glow)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g className="os-pulse">
          <circle cx="74" cy="92" r="10" stroke="#ffd23e" strokeWidth="1.8" />
          <path d="M74 85 L76 90 L81 90 L77 93 L78.5 98 L74 95 L69.5 98 L71 93 L67 90 L72 90 Z" stroke="#ffd23e" strokeWidth="1.2" />
        </g>
        <path d="M60 116 H86 M80 111 L86 116 L80 121" stroke="#5dff9a" strokeWidth="1.8" className="os-flicker" style={{ animationDelay: '-1.5s' }} />
        <path d="M350 82 L360 94 L350 106 L340 94 Z" stroke="#9b7bff" strokeWidth="1.8" className="os-pulse" style={{ animationDelay: '-1s' }} />
      </g>

      {/* たこ焼き sign */}
      <g filter="url(#os-glow)">
        <rect x="194" y="96" width="68" height="20" rx="3" fill="#1a0f30" stroke="#ff5fb4" strokeWidth="1.8" className="os-pulse" />
        <text x="228" y="110.5" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="10" fill="#fff3a8">
          たこ焼き
        </text>
      </g>

      {/* Vertical 大阪 sign */}
      <g filter="url(#os-glow)">
        <rect x="286" y="62" width="24" height="56" rx="2" fill="#120c2a" stroke="#3ef0ff" strokeWidth="1.8" />
        <text x="298" y="84" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="15" fill="#bff9ff">
          大
        </text>
        <text x="298" y="107" textAnchor="middle" fontFamily="'Dela Gothic One', sans-serif" fontSize="15" fill="#bff9ff" className="os-flicker">
          阪
        </text>
      </g>

      {/* Hero: the giant crab sign */}
      <CrabHalf offset={0} />
      <g transform="matrix(-1 0 0 1 286 0)">
        <CrabHalf offset={-0.45} />
      </g>
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <g className="os-eye">
          <path d="M136 90 L134 81" />
          <circle cx="134" cy="79" r="3.6" fill="#fff" />
          <circle cx="134.6" cy="79.4" r="1.4" fill={INK} stroke="none" />
        </g>
        <g className="os-eye" style={{ animationDelay: '-.9s' }}>
          <path d="M150 90 L152 81" />
          <circle cx="152" cy="79" r="3.6" fill="#fff" />
          <circle cx="152.6" cy="79.4" r="1.4" fill={INK} stroke="none" />
        </g>
        <ellipse cx="143" cy="100" rx="24" ry="13" fill="#ff4a3d" />
      </g>
      <ellipse cx="137" cy="95" rx="10" ry="3.6" fill="#ff8a6a" />
      <path d="M137 104 Q143 109 149 104" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      {[[130, 101], [156, 101], [150, 96]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="1.3" fill="#c42a26" />
      ))}

      {/* Takoyaki stall with steam */}
      {[[220, 124, 0], [230, 122, -1], [240, 125, -2]].map(([x, y, d]) => (
        <circle key={x} cx={x} cy={y} r="4" fill="#fff" className="os-steam" style={{ animationDelay: `${d}s` }} />
      ))}
      <g stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
        <rect x="208" y="130" width="42" height="15" fill="#6a3a2a" />
        <path d="M204 131 L212 123 L246 123 L254 131 Z" fill="#e8342a" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={211 + i * 9.5} y="131" width="8" height="6" fill="#f6efe0" strokeWidth="1" />
        ))}
        <ellipse cx="252" cy="137" rx="3" ry="4" fill="#ff5a3a" />
      </g>

      {/* Railing and walkway */}
      <rect y="145" width="400" height="5" fill="#3a2d5a" stroke={INK} strokeWidth="1.4" />
      <path d="M0 141 H400" stroke="#8a7ab0" strokeWidth="1" />
      {Array.from({ length: 21 }, (_, i) => (
        <path key={i} d={`M${i * 20} 141 V145`} stroke="#8a7ab0" strokeWidth="1" />
      ))}

      {/* Canal with shimmering neon reflections */}
      <rect y="150" width="400" height="50" fill="url(#os-water)" />
      {REFL.map(([cx, w, c], i) =>
        Array.from({ length: 8 }, (_, j) => {
          const ww = w * (1 - j * 0.07)
          return (
            <rect
              key={`${i}-${j}`}
              x={cx - ww / 2 + (j % 2 ? 1.5 : -1.5)}
              y={152 + j * 5.5}
              width={ww}
              height="2.6"
              rx="1.3"
              fill={c}
              opacity={0.85 - j * 0.09}
              className="os-shimmer"
              style={{ animationDelay: `${-(i * 0.3 + j * 0.22)}s` }}
            />
          )
        }),
      )}
      <g className="os-ripple">
        {[158, 168, 180, 192].map((y) => (
          <path key={y} d={`M0 ${y} H440`} stroke="#fff" strokeWidth=".8" strokeDasharray="6 14" opacity=".18" />
        ))}
      </g>

      {/* Tour boat gliding along the canal */}
      <g transform="translate(0 176)">
        <g className="os-boat">
          <g className="os-bob">
            <path d="M-6 6 H-20 M-4 10 H-16" stroke="#fff" strokeWidth=".9" opacity=".5" strokeLinecap="round" />
            <g stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
              <rect x="14" y="-10" width="44" height="10" fill="#2a2150" />
              <rect x="10" y="-13" width="52" height="3" fill="#ff5f5f" />
              <path d="M0 0 L74 0 L68 9 L6 9 Z" fill="#f2f2ff" />
              <path d="M64 -13 V-22" />
              <path d="M64 -22 L70 -19.5 L64 -17 Z" fill="#ffd23e" />
            </g>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={17 + i * 10} y="-8" width="7" height="5" fill="#ffd98a" />
            ))}
            <path d="M4 4 H70" stroke="#3ef0ff" strokeWidth="1.2" />
          </g>
        </g>
      </g>
    </svg>
  )
}
