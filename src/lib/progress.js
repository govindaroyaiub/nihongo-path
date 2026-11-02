import { LESSONS, UNITS, getUnit } from './curriculum'
import { getState, isLessonPassed } from './store'
import { isDue } from './sm2'

// Linear unlock: a lesson opens once the one before it is passed. Since every
// unit ends in a checkpoint, a unit opens only after the previous checkpoint.
// The "Unlock all lessons" setting opens everything without passing anything.
export function lessonStatus(lessonId, lessons) {
  const index = LESSONS.findIndex((l) => l.id === lessonId)
  if (index < 0) return 'locked'
  if (isLessonPassed(lessonId, lessons)) return 'done'
  if (getState().settings.unlockAll) return 'open'
  if (index === 0 || isLessonPassed(LESSONS[index - 1].id, lessons)) return 'open'
  return 'locked'
}

// The first lesson not yet passed — where "Continue" takes you.
export function currentLesson(lessons) {
  return LESSONS.find((l) => !isLessonPassed(l.id, lessons)) ?? null
}

export function unitProgress(unitId, lessons) {
  const unit = getUnit(unitId)
  const done = unit.lessons.filter((l) => isLessonPassed(l.id, lessons)).length
  const total = unit.lessons.length
  const firstStatus = lessonStatus(unit.lessons[0].id, lessons)
  return { done, total, complete: done === total, locked: firstStatus === 'locked' }
}

export function levelProgress(level, lessons) {
  const units = UNITS.filter((u) => u.level === level)
  const all = units.flatMap((u) => u.lessons)
  return { done: all.filter((l) => isLessonPassed(l.id, lessons)).length, total: all.length }
}

export function dueItemIds(srs, now = new Date()) {
  return Object.values(srs)
    .filter((row) => isDue(row, now))
    .map((row) => row.item_id)
}

export function streakFrom(log) {
  const days = new Set(Object.keys(log))
  const cursor = new Date()
  const key = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  if (!days.has(key(cursor))) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (days.has(key(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
