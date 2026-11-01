import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { STOPS, stampState, project, geo } from '../lib/places'
import { stopFor } from '../lib/journey'

// Illustrated map of Japan with a pin per journey stop. Cleared stops glow red
// like a goshuin seal; the dashed line traces the trip in course order.
export default function JapanMap({ className = '' }) {
  const navigate = useNavigate()
  const lessons = useStore((s) => s.lessons)
  const pins = STOPS.map((u) => ({ unit: u, ...project(u.place.lat, u.place.lng), ...stampState(u, lessons) }))
  // Zoom to the part of Japan the journey covers (padded), instead of the whole
  // country, so the stops spread out across the map.
  const xs = pins.map((p) => p.x)
  const ys = pins.map((p) => p.y)
  const pad = 14
  let vx = Math.min(...xs) - pad
  let vy = Math.min(...ys) - pad
  let vw = Math.max(...xs) - vx + pad
  let vh = Math.max(...ys) - vy + pad
  // Keep a pleasant aspect (not taller than square, not wider than 16:10).
  if (vh > vw) {
    vx -= (vh - vw) / 2
    vw = vh
  }
  if (vw / vh > 1.6) {
    vy -= (vw / 1.6 - vh) / 2
    vh = vw / 1.6
  }
  const R = vw / 34 // pin radius in map units

  // Tokyo-area stops sit close together: nudge pins apart until no two overlap.
  const spread = pins.map((p) => ({ ...p }))
  const MIN = R * 2.2
  for (let iter = 0; iter < 60; iter++) {
    for (let i = 0; i < spread.length; i++) {
      for (let j = i + 1; j < spread.length; j++) {
        const a = spread[i]
        const b = spread[j]
        let dx = b.x - a.x
        let dy = b.y - a.y
        const d = Math.hypot(dx, dy) || 0.01
        if (d >= MIN) continue
        if (d < 0.1) [dx, dy] = [Math.cos(i + j), Math.sin(i + j)]
        const push = (MIN - d) / 2
        a.x -= (dx / d) * push
        a.y -= (dy / d) * push
        b.x += (dx / d) * push
        b.y += (dy / d) * push
      }
    }
  }
  const route = spread.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  return (
    <div className={`relative rounded-3xl border-[2.5px] border-outline overflow-hidden ${className}`} style={{ boxShadow: '5px 5px 0 0 rgb(var(--outline))', background: 'linear-gradient(160deg, #8fd3ff, #c9ecff 60%, #ffe3ee)' }}>
      <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} preserveAspectRatio="xMidYMid meet" className="w-full h-auto max-h-[62svh] block" role="img" aria-label="Map of Japan with your journey stops">
        <defs>
          <pattern id="waves" width="12" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 5 Q3 1 6 5 T12 5" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect x={vx} y={vy} width={vw} height={vh} fill="url(#waves)" />
        <path d={geo.d} fill="#9be29f" stroke="#261e3e" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <polyline points={route} fill="none" stroke="#261e3e" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.55" vectorEffect="non-scaling-stroke" />
        {spread.map((p) => {
          const stop = stopFor(p.unit)
          return (
            <g key={p.unit.id} transform={`translate(${p.x} ${p.y})`} className="cursor-pointer" onClick={() => navigate(`/place/${p.unit.id}`)}>
              <title>{stop.place}</title>
              <circle r={R} fill={p.earned ? '#e23b3b' : '#ffffff'} stroke="#261e3e" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              <text textAnchor="middle" dy={R * 0.38} fontSize={R * 1.05}>
                {stop.emoji}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="absolute left-3 bottom-2 text-[10px] font-bold text-[#261e3e]/50">Your N5 route · Natural Earth</p>
    </div>
  )
}
