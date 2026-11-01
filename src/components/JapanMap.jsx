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
  // Tokyo-area stops sit close together; fan them out a little so each pin is tappable.
  const spread = pins.map((p, i) => {
    const near = pins.filter((q, j) => j < i && Math.hypot(q.x - p.x, q.y - p.y) < 10).length
    const a = (near * 2.4) % (Math.PI * 2)
    return { ...p, x: p.x + (near ? Math.cos(a) * 12 * Math.sqrt(near) : 0), y: p.y + (near ? Math.sin(a) * 12 * Math.sqrt(near) : 0) }
  })
  const route = spread.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  return (
    <div className={`relative rounded-3xl border-[2.5px] border-outline overflow-hidden ${className}`} style={{ boxShadow: '5px 5px 0 0 rgb(var(--outline))', background: 'linear-gradient(160deg, #8fd3ff, #c9ecff 60%, #ffe3ee)' }}>
      <svg viewBox={`-20 -10 ${geo.width + 40} ${geo.height + 20}`} className="w-full h-auto block" role="img" aria-label="Map of Japan with your journey stops">
        <defs>
          <pattern id="waves" width="24" height="12" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q6 2 12 10 T24 10" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect x="-20" y="-10" width={geo.width + 40} height={geo.height + 20} fill="url(#waves)" />
        <path d={geo.d} fill="#9be29f" stroke="#261e3e" strokeWidth="2" strokeLinejoin="round" />
        <polyline points={route} fill="none" stroke="#261e3e" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" opacity="0.55" />
        {spread.map((p) => {
          const stop = stopFor(p.unit)
          return (
            <g key={p.unit.id} transform={`translate(${p.x} ${p.y})`} className="cursor-pointer" onClick={() => navigate(`/place/${p.unit.id}`)}>
              <title>{stop.place}</title>
              <circle r="11" fill={p.earned ? '#e23b3b' : '#ffffff'} stroke="#261e3e" strokeWidth="2.5" />
              <text textAnchor="middle" dy="4" fontSize="11">
                {stop.emoji}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="absolute left-3 bottom-2 text-[10px] font-bold text-[#261e3e]/50">Main islands · Natural Earth</p>
    </div>
  )
}
