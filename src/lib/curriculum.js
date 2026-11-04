import { KANA_UNITS } from '../content/kana'

// Every unit JSON under src/content/<level>/ is picked up automatically, so
// adding unit-13.json is all it takes to extend the course.
const unitFiles = import.meta.glob('../content/*/unit-*.json', { eager: true, import: 'default' })
// Place cards (history, sites, travel reading) keyed by unit id — see docs/superpowers/specs/places-schema.md.
const placeFiles = import.meta.glob('../content/places/*.json', { eager: true, import: 'default' })
const PLACES = Object.fromEntries(Object.values(placeFiles).map((p) => [p.unitId, p]))

const VOCAB_PER_LESSON = 8
const KANJI_PER_LESSON = 5

export const LEVELS = [
  { id: 'N5', title: 'N5', subtitle: 'Foundations', color: 'oklch(58% 0.14 40)' },
  { id: 'N4', title: 'N4', subtitle: 'Everyday Japanese', color: 'oklch(50% 0.09 230)' },
]

function chunk(list, size) {
  const out = []
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size))
  // Fold a tiny trailing chunk into the previous lesson rather than leave a 1–2 item lesson.
  if (out.length > 1 && out[out.length - 1].length < size / 2) {
    out[out.length - 2].push(...out.pop())
  }
  return out
}

// Interleaves a unit's content into one fixed rhythm:
// vocab → grammar → vocab → grammar … with kanji slotted in, then reading,
// listening and the checkpoint. Every unit therefore feels the same to walk.
function buildLessons(unit) {
  const vocab = chunk(unit.vocab ?? [], VOCAB_PER_LESSON).map((group, i) => ({
    kind: 'vocab',
    title: `Words ${i + 1}`,
    items: group.map((v) => v.id),
  }))
  const grammar = (unit.grammar ?? []).map((g) => ({ kind: 'grammar', title: g.title, items: [g.id] }))
  const kanji = chunk(unit.kanji ?? [], KANJI_PER_LESSON).map((group) => ({
    kind: 'kanji',
    title: `Kanji ${group.map((k) => k.char).join(' ')}`,
    items: group.map((k) => k.id),
  }))

  const lessons = []
  const queues = [vocab, grammar]
  // Kanji lessons land at the ⅓ and ⅔ points of the unit.
  const total = vocab.length + grammar.length
  const kanjiSlots = kanji.map((_, i) => Math.round(((i + 1) * total) / (kanji.length + 1)))
  let turn = 0
  while (vocab.length || grammar.length) {
    const queue = queues[turn % 2].length ? queues[turn % 2] : queues[(turn + 1) % 2]
    lessons.push(queue.shift())
    turn++
    while (kanjiSlots.length && lessons.length >= kanjiSlots[0]) {
      kanjiSlots.shift()
      lessons.push(kanji.shift())
    }
  }
  lessons.push(...kanji)

  if (unit.reading) lessons.push({ kind: 'reading', title: unit.reading.title, items: [] })
  if (unit.listening) lessons.push({ kind: 'listening', title: unit.listening.title, items: [] })
  if (unit.place?.reading) lessons.push({ kind: 'travel', title: `Explore ${unit.place.place}`, items: [] })
  lessons.push({
    kind: 'checkpoint',
    title: 'Unit checkpoint',
    items: [...(unit.vocab ?? []), ...(unit.kanji ?? []), ...(unit.grammar ?? [])].map((x) => x.id),
  })

  return lessons.map((lesson, i) => ({
    ...lesson,
    id: lesson.kind === 'checkpoint' ? `${unit.id}-check` : `${unit.id}-l${String(i + 1).padStart(2, '0')}`,
  }))
}

function buildUnit(raw) {
  const items = [
    ...(raw.vocab ?? []).map((v) => ({ ...v, type: 'vocab' })),
    ...(raw.kanji ?? []).map((k) => ({ ...k, type: 'kanji' })),
    ...(raw.grammar ?? []).map((g) => ({ ...g, type: 'grammar' })),
  ]
  const unit = { ...raw, place: PLACES[raw.id] ?? null }
  return { ...unit, items, lessons: buildLessons(unit) }
}

const contentUnits = Object.values(unitFiles)
  .map(buildUnit)
  .sort((a, b) => (a.level === b.level ? a.number - b.number : a.level < b.level ? 1 : -1))

// Course order: N5 kana, N5 units, then N4 units.
export const UNITS = [...KANA_UNITS.map((u) => ({ ...u, place: PLACES[u.id] ?? null })), ...contentUnits].map((unit, order) => ({ ...unit, order }))

export const LESSONS = UNITS.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ ...lesson, unitId: unit.id, level: unit.level }))
)

const unitById = new Map(UNITS.map((u) => [u.id, u]))
const lessonById = new Map(LESSONS.map((l, index) => [l.id, { ...l, index }]))
const itemById = new Map()
for (const unit of UNITS) {
  for (const item of unit.items) itemById.set(item.id, { ...item, unitId: unit.id, level: unit.level })
}

export const getUnit = (id) => unitById.get(id)
export const getLesson = (id) => lessonById.get(id)
export const getItem = (id) => itemById.get(id)
export const allItems = () => [...itemById.values()]

export function unitsForLevel(level) {
  return UNITS.filter((u) => u.level === level)
}

// Lesson index where each item is first taught (checkpoints don't count).
const introducedAt = new Map()
LESSONS.forEach((lesson, index) => {
  if (lesson.kind === 'checkpoint') return
  for (const id of lesson.items) if (!introducedAt.has(id)) introducedAt.set(id, index)
})

// Items of the same type taught no later than this one — the pool exercises
// draw distractors from, so wrong options are things you've already seen.
// Early on (first kana lesson) the pool is padded with the next items taught.
export function knownPeers(item, minimum = 4) {
  const at = introducedAt.get(item.id) ?? Infinity
  const peers = allItems().filter((i) => i.type === item.type && i.script === item.script)
  const known = peers.filter((i) => (introducedAt.get(i.id) ?? Infinity) <= at)
  if (known.length >= minimum) return known
  const upcoming = peers
    .filter((i) => !known.includes(i))
    .sort((a, b) => (introducedAt.get(a.id) ?? Infinity) - (introducedAt.get(b.id) ?? Infinity))
  return [...known, ...upcoming.slice(0, minimum - known.length)]
}

// Taught in a lesson that comes before `lesson` on the path.
export const taughtBefore = (itemId, lesson) => (introducedAt.get(itemId) ?? Infinity) < lessonById.get(lesson.id).index

export function nextLessonId(lessonId) {
  const lesson = lessonById.get(lessonId)
  return lesson ? LESSONS[lesson.index + 1]?.id ?? null : null
}
