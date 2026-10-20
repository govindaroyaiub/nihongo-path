import { useState, useEffect, useCallback } from 'react'
import { loadProgress, saveProgressRows, deleteModuleProgress, bumpStudyLog } from '../lib/store'
import { reviewCard, isDue } from '../lib/sm2'

// Loads + mutates progress rows for a single module's cards, stored on this device.
export function useProgress(moduleId, cards) {
  const [progressByCardId, setProgressByCardId] = useState({})
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    const map = {}
    for (const row of Object.values(loadProgress())) {
      if (row.module === moduleId) map[row.card_id] = row
    }
    setProgressByCardId(map)
    setLoading(false)
  }, [moduleId])

  useEffect(() => {
    load()
  }, [load])

  const cardsWithProgress = cards.map((card) => ({
    ...card,
    progress: progressByCardId[card.id] || null,
  }))

  const dueCards = cardsWithProgress.filter((c) => isDue(c.progress))
  const newCount = cardsWithProgress.filter((c) => !c.progress).length
  const masteredCount = cardsWithProgress.filter((c) => c.progress?.status === 'mastered').length

  async function recordReview(cardId, correct) {
    const existing = progressByCardId[cardId]
    const updated = reviewCard(existing, correct)
    const row = {
      ...existing,
      card_id: cardId,
      module: moduleId,
      updated_at: new Date().toISOString(),
      ...updated,
    }

    saveProgressRows([row])
    setProgressByCardId((prev) => ({ ...prev, [cardId]: row }))
    bumpStudyLog()
    return row
  }

  async function resetModule() {
    deleteModuleProgress(moduleId)
    setProgressByCardId({})
  }

  async function redoModule() {
    const today = new Date().toISOString().slice(0, 10)
    const now = new Date().toISOString()
    const rows = Object.values(progressByCardId).map((row) => ({
      ...row,
      next_review_date: today,
      updated_at: now,
    }))

    saveProgressRows(rows)
    const map = {}
    for (const row of rows) map[row.card_id] = row
    setProgressByCardId(map)
  }

  return {
    loading,
    cardsWithProgress,
    dueCards,
    newCount,
    masteredCount,
    totalCount: cards.length,
    recordReview,
    resetModule,
    redoModule,
    reload: load,
  }
}
