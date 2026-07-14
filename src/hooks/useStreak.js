import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { USER_ID } from '../lib/userId'

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

// Reads study_log and derives a consecutive-day streak (counts today only
// if already studied today, otherwise checks back from yesterday).
export function useStreak() {
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('study_log')
        .select('log_date')
        .eq('user_id', USER_ID)
        .order('log_date', { ascending: false })
        .limit(400)

      if (!error && !cancelled) {
        setStreak(computeStreak((data || []).map((r) => r.log_date)))
      }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { streak, loading }
}
