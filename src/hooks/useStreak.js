import { useState, useEffect } from 'react'
import { loadStudyLog } from '../lib/store'

function computeStreak(datesDesc) {
  const dates = new Set(datesDesc)
  if (dates.size === 0) return 0

  const cursor = new Date()
  const todayStr = cursor.toISOString().slice(0, 10)
  if (!dates.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

// Reads the study log and derives a consecutive-day streak (counts today only
// if already studied today, otherwise checks back from yesterday).
export function useStreak() {
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setStreak(computeStreak(Object.keys(loadStudyLog())))
    setLoading(false)
  }, [])

  return { streak, loading }
}
