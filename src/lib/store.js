// Device-local persistence for progress and the study log. Everything lives in
// localStorage, so progress belongs to this browser — no account, no server.
const PROGRESS_KEY = 'nihongo-path:progress'
const STUDY_LOG_KEY = 'nihongo-path:study-log'

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {}
  } catch {
    return {}
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(error)
  }
}

// { [card_id]: progressRow }
export function loadProgress() {
  return read(PROGRESS_KEY)
}

export function saveProgressRows(rows) {
  const all = loadProgress()
  for (const row of rows) all[row.card_id] = row
  write(PROGRESS_KEY, all)
}

export function deleteModuleProgress(moduleId) {
  const all = loadProgress()
  for (const [cardId, row] of Object.entries(all)) {
    if (row.module === moduleId) delete all[cardId]
  }
  write(PROGRESS_KEY, all)
}

// { [YYYY-MM-DD]: cardsReviewed }
export function loadStudyLog() {
  return read(STUDY_LOG_KEY)
}

export function bumpStudyLog() {
  const today = new Date().toISOString().slice(0, 10)
  const log = loadStudyLog()
  log[today] = (log[today] || 0) + 1
  write(STUDY_LOG_KEY, log)
}
