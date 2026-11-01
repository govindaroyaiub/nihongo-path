import { PlaceCard } from '../Places'
import ReadingTeach from './ReadingTeach'
import { MascotSays } from '../Mascot'
import JpText from '../JpText'

// Travel lesson: explore the place card, then read about it in Japanese.
export default function TravelTeach({ unit }) {
  const place = unit.place
  return (
    <div className="flex flex-col gap-6">
      <MascotSays pose="wave" size={56}>
        Welcome to {place.place}! Look around, then read about it in Japanese.
      </MascotSays>
      <PlaceCard place={place} unit={unit} />
      <section>
        <p className="eyebrow text-torii mb-1">Travel reading</p>
        <JpText text={place.reading.title} className="font-title text-2xl block mb-3" />
        <ReadingTeach reading={place.reading} />
      </section>
    </div>
  )
}
