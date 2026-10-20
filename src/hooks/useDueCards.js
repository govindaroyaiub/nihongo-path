import { useState, useEffect, useCallback } from 'react'
import { loadProgress } from '../lib/store'
import { MODULES } from '../lib/modules'
import { isDue } from '../lib/sm2'

// Aggregates progress across all modules for the Home dashboard: per-module
// progress bars + a combined "cards due today" count.
export function useDueCards() {
  const [progressByCardId, setProgressByCardId] = useState({})
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setProgressByCardId(loadProgress())
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const moduleStats = MODULES.map((mod) => {
    const total = mod.cards.length
    let due = 0
    let mastered = 0
    let started = 0

    for (const card of mod.cards) {
      const p = progressByCardId[card.id]
      if (p) {
        started++
        if (p.status === 'mastered') mastered++
      }
      if (isDue(p)) due++
    }

    return {
      id: mod.id,
      title: mod.title,
      subtitle: mod.subtitle,
      glyph: mod.glyph,
      color: mod.color,
      total,
      due,
      mastered,
      started,
    }
  })

  const totalDue = moduleStats.reduce((sum, m) => sum + m.due, 0)

  return { loading, moduleStats, totalDue, reload: load }
}
