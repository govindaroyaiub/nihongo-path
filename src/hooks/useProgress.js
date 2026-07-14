import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { reviewCard, isDue } from '../lib/sm2'

async function bumpStudyLog(userId) {
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await supabase
    .from('study_log')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', today)
    .maybeSingle()

  if (data) {
    await supabase
      .from('study_log')
      .update({ cards_reviewed: data.cards_reviewed + 1 })
      .eq('user_id', userId)
      .eq('log_date', today)
  } else {
    await supabase.from('study_log').insert({ user_id: userId, log_date: today, cards_reviewed: 1 })
  }
}

// Loads + mutates progress rows for a single module's cards, backed by Supabase.
export function useProgress(moduleId, cards) {
  const { user } = useAuth()
  const userId = user?.id
  const [progressByCardId, setProgressByCardId] = useState({})
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module', moduleId)

    if (error) {
      console.error(error)
    } else {
      const map = {}
      for (const row of data) map[row.card_id] = row
      setProgressByCardId(map)
    }
    setLoading(false)
  }, [moduleId, userId])

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
    if (!userId) return
    const existing = progressByCardId[cardId]
    const updated = reviewCard(existing, correct)
    const row = {
      user_id: userId,
      card_id: cardId,
      module: moduleId,
      updated_at: new Date().toISOString(),
      ...updated,
    }

    const { data, error } = await supabase
      .from('progress')
      .upsert(row, { onConflict: 'user_id,card_id' })
      .select()
      .single()

    if (error) {
      console.error(error)
      return
    }

    setProgressByCardId((prev) => ({ ...prev, [cardId]: data }))
    bumpStudyLog(userId)
  }

  async function resetModule() {
    if (!userId) return
    const { error } = await supabase.from('progress').delete().eq('user_id', userId).eq('module', moduleId)

    if (error) {
      console.error(error)
      return
    }
    setProgressByCardId({})
  }

  async function redoModule() {
    if (!userId) return
    const today = new Date().toISOString().slice(0, 10)
    const { data, error } = await supabase
      .from('progress')
      .update({ next_review_date: today, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('module', moduleId)
      .select()

    if (error) {
      console.error(error)
      return
    }

    const map = { ...progressByCardId }
    for (const row of data) map[row.card_id] = row
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
