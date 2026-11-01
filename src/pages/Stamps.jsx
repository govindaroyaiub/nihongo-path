import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { STOPS, stampState } from '../lib/places'
import { Stamp } from '../components/Places'
import PageHeader from '../components/PageHeader'
import JapanMap from '../components/JapanMap'
import { MascotSays } from '../components/Mascot'

// Goshuin-chō: the stamp book you fill by clearing each stop, plus the map.
export default function Stamps() {
  const lessons = useStore((s) => s.lessons)
  const states = STOPS.map((u) => ({ unit: u, ...stampState(u, lessons) }))
  const earned = states.filter((s) => s.earned).length

  return (
    <div className="pb-10">
      <PageHeader eyebrow="御朱印帳 · Stamp book" title="Your journey" />
      <MascotSays pose={earned ? 'celebrate' : 'wave'} size={56}>
        {earned ? `${earned} of ${STOPS.length} stamps collected. Keep travelling!` : 'Clear a checkpoint to get your first temple stamp!'}
      </MascotSays>

      <div className="mt-6">
        <JapanMap />
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-10 justify-items-center pb-6">
        {states.map((s) => (
          <Link key={s.unit.id} to={`/place/${s.unit.id}`} className="active:scale-95 transition-transform">
            <Stamp place={s.unit.place} unit={s.unit} earned={s.earned} date={s.date} />
          </Link>
        ))}
      </div>
    </div>
  )
}
