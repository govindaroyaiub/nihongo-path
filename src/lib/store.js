import { useSyncExternalStore } from 'react'
import { reviewCard, toDateString } from './sm2'

// Device-local persistence. Everything lives in localStorage, so progress
// belongs to this browser — no account, no server. The `np2:` prefix keeps
// v2 data apart from the old flashcard app's keys.
const KEYS = {
  lessons: 'np2:lessons', // { [lessonId]: { best, passed, completedAt } }
  srs: 'np2:srs', // { [itemId]: sm2Row }
  log: 'np2:log', // { [YYYY-MM-DD]: { reviews, lessons, xp } }
  settings: 'np2:settings',
}

const DEFAULT_SETTINGS = {
  voiceURI: null, // Web Speech fallback voice; null = best available
  rate: 0.9,
  autoplay: true,
  furigana: true,
  romaji: true,
  sounds: true,
  dailyGoal: 30, // XP per day
  theme: 'system', // system | light | dark
  unlockAll: false, // open every lesson without marking anything done (for reviewing content)
}

// XP: a lesson is worth 10 (+5 for a perfect run), a checkpoint 20, a correct review 1.
export function lessonXp(kind, score) {
  const base = kind === 'checkpoint' ? 20 : 10
  return base + (score === 1 ? 5 : 0)
}

const PASS_MARK = 0.8

function read(key, fallback = {}) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(error)
  }
}

let state = {
  lessons: read(KEYS.lessons),
  srs: read(KEYS.srs),
  log: read(KEYS.log),
  settings: { ...DEFAULT_SETTINGS, ...read(KEYS.settings) },
}

const listeners = new Set()

function commit(patch) {
  state = { ...state, ...patch }
  for (const key of Object.keys(patch)) write(KEYS[key], state[key])
  listeners.forEach((fn) => fn())
}

function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useStore(selector = (s) => s) {
  return useSyncExternalStore(subscribe, () => selector(state))
}

export const getState = () => state

export function today() {
  return toDateString(new Date())
}

function bumpLog(field, xp = 0) {
  const day = today()
  const entry = { reviews: 0, lessons: 0, xp: 0, ...state.log[day] }
  entry[field] += 1
  entry.xp += xp
  return { ...state.log, [day]: entry }
}

export function isLessonPassed(lessonId, lessons = state.lessons) {
  return Boolean(lessons[lessonId]?.passed)
}

// Ordinary lessons pass by finishing them (mistakes are re-asked until right);
// checkpoints need PASS_MARK on first attempts.
export function passes(kind, score) {
  return kind !== 'checkpoint' || score >= PASS_MARK
}

// Saves a finished lesson. `results` maps itemId → answered correctly on the
// first try; each item gets an SM-2 review so it lands in the Review queue.
export function completeLesson(lessonId, { kind, score, results = {} }) {
  const prev = state.lessons[lessonId]
  const lessons = {
    ...state.lessons,
    [lessonId]: {
      best: Math.max(prev?.best ?? 0, score),
      passed: Boolean(prev?.passed) || passes(kind, score),
      completedAt: new Date().toISOString(),
    },
  }
  const srs = { ...state.srs }
  for (const [itemId, correct] of Object.entries(results)) {
    srs[itemId] = { ...srs[itemId], item_id: itemId, ...reviewCard(srs[itemId], correct) }
  }
  const xp = passes(kind, score) ? lessonXp(kind, score) : 2
  commit({ lessons, srs, log: bumpLog('lessons', xp) })
  return xp
}

export function recordReview(itemId, correct) {
  const srs = { ...state.srs, [itemId]: { ...state.srs[itemId], item_id: itemId, ...reviewCard(state.srs[itemId], correct) } }
  commit({ srs, log: bumpLog('reviews', correct ? 1 : 0) })
}

export function updateSettings(patch) {
  commit({ settings: { ...state.settings, ...patch } })
  if ('theme' in patch) applyTheme()
}

// Light/dark: follows the system unless the learner picked one.
export function applyTheme() {
  if (typeof document === 'undefined') return
  const pref = state.settings.theme
  const dark = pref === 'dark' || (pref === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
}
if (typeof window !== 'undefined') {
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme)
}

export function xpToday(log = state.log) {
  return log[today()]?.xp ?? 0
}

export function xpTotal(log = state.log) {
  return Object.values(log).reduce((sum, d) => sum + (d.xp ?? 0), 0)
}

export function resetAll() {
  commit({ lessons: {}, srs: {}, log: {} })
}

export const PASS_PERCENT = Math.round(PASS_MARK * 100)
