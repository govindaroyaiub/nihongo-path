import { useParams, Navigate } from 'react-router-dom'
import { getUnit } from '../lib/curriculum'
import { useStore } from '../lib/store'
import { stampState } from '../lib/places'
import { PlaceCard, Stamp } from '../components/Places'
import PageHeader from '../components/PageHeader'

export default function Place() {
  const { unitId } = useParams()
  const unit = getUnit(unitId)
  const lessons = useStore((s) => s.lessons)
  if (!unit?.place) return <Navigate to="/map" replace />
  const stamp = stampState(unit, lessons)
  return (
    <div className="pb-10">
      <PageHeader eyebrow="Journey stop" title={unit.place.place} />
      <PlaceCard place={unit.place} unit={unit} />
      <div className="mt-8 panel p-5 flex items-center gap-5">
        <Stamp place={unit.place} unit={unit} earned={stamp.earned} date={stamp.date} size={96} />
        <p className="font-bold text-ink/70 text-[15px]">
          {stamp.earned ? 'You collected this stamp. お疲れさま！' : `Pass the ${unit.kana ? 'prologue' : 'episode'} checkpoint to collect the ${unit.place.place} stamp.`}
        </p>
      </div>
    </div>
  )
}
