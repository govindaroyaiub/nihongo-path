const MASTERED_INTERVAL_DAYS = 21

const DEFAULT_CARD = {
  ease_factor: 2.5,
  interval_days: 0,
  repetitions: 0,
  correct_count: 0,
  incorrect_count: 0,
  status: 'new',
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function toDateString(date) {
  return date.toISOString().slice(0, 10)
}

// Standard SM-2, fed a binary correct/incorrect result mapped to a quality
// score (5 = correct, 2 = incorrect) since the UI only exposes a binary
// swipe / right-wrong signal rather than Anki's 4-way grading.
export function reviewCard(card, correct, now = new Date()) {
  const prev = { ...DEFAULT_CARD, ...card }
  const quality = correct ? 5 : 2

  let { ease_factor, interval_days, repetitions } = prev

  if (quality < 3) {
    repetitions = 0
    interval_days = 1
  } else {
    if (repetitions === 0) {
      interval_days = 1
    } else if (repetitions === 1) {
      interval_days = 6
    } else {
      interval_days = Math.round(interval_days * ease_factor)
    }
    repetitions += 1
  }

  ease_factor = Math.max(
    1.3,
    ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  const status =
    repetitions === 0
      ? 'learning'
      : interval_days >= MASTERED_INTERVAL_DAYS
        ? 'mastered'
        : 'review'

  return {
    ease_factor: Number(ease_factor.toFixed(2)),
    interval_days,
    repetitions,
    next_review_date: toDateString(addDays(now, interval_days)),
    status,
    correct_count: prev.correct_count + (correct ? 1 : 0),
    incorrect_count: prev.incorrect_count + (correct ? 0 : 1),
    last_reviewed_at: now.toISOString(),
  }
}

export function isDue(card, now = new Date()) {
  if (!card || !card.next_review_date) return true
  return card.next_review_date <= toDateString(now)
}
