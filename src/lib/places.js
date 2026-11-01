import { UNITS } from './curriculum'
import { isLessonPassed } from './store'
import geo from '../content/geo/japan.json'

// Journey stops that have a place card, in course order.
export const STOPS = UNITS.filter((u) => u.place)

// A stop's stamp is earned by passing its unit checkpoint.
export function stampState(unit, lessons) {
  const check = unit.lessons.find((l) => l.kind === 'checkpoint')
  return { earned: check ? isLessonPassed(check.id, lessons) : false, date: check ? lessons[check.id]?.completedAt : null }
}

// lat/lng → x/y in the map's SVG coordinate space (same projection as the outline).
export function project(lat, lng) {
  const { bounds, k, scale } = geo
  return { x: (lng - bounds.lonMin) * k * scale, y: (bounds.latMax - lat) * scale }
}

export { geo }
