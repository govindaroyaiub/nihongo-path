import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { RotateCcw, Trash2, Layers, PencilLine } from 'lucide-react'
import { getModule } from '../lib/modules'
import { useProgress } from '../hooks/useProgress'
import ProgressBar from '../components/ProgressBar'
import ConfirmDialog from '../components/ConfirmDialog'

export default function ModuleHome() {
  const { moduleId } = useParams()
  const mod = getModule(moduleId)
  const { loading, dueCards, masteredCount, totalCount, resetModule, redoModule } = useProgress(
    moduleId,
    mod?.cards ?? []
  )
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmRedo, setConfirmRedo] = useState(false)

  if (!mod) return <Navigate to="/" replace />

  return (
    <div className="flex-1 overflow-y-auto px-5 pt-8 pb-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">{mod.title}</h1>
        <p className="text-sm text-ink/50">{mod.subtitle}</p>
      </header>

      <div className="bg-white rounded-2xl border border-ink/10 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink/60">
            {masteredCount}/{totalCount} mastered
          </span>
          <span className="text-sm text-ink/60">{loading ? '—' : dueCards.length} due today</span>
        </div>
        <ProgressBar value={masteredCount} max={totalCount} color={mod.color} />
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <Link
          to={`/module/${moduleId}/flashcards`}
          className="flex items-center gap-3 bg-accent text-white rounded-2xl px-5 py-4 font-medium active:opacity-90"
        >
          <Layers size={20} />
          Study flashcards
        </Link>
        <Link
          to={`/module/${moduleId}/quiz`}
          className="flex items-center gap-3 bg-white border-2 border-ink/10 rounded-2xl px-5 py-4 font-medium active:bg-ink/5"
        >
          <PencilLine size={20} />
          Take a quiz
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setConfirmRedo(true)}
          className="flex items-center gap-3 text-ink/70 rounded-2xl px-5 py-3 font-medium border border-ink/10 active:bg-ink/5"
        >
          <RotateCcw size={18} />
          Redo module (keep stats)
        </button>
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="flex items-center gap-3 text-danger rounded-2xl px-5 py-3 font-medium border border-danger/30 active:bg-danger/5"
        >
          <Trash2 size={18} />
          Reset progress
        </button>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset progress?"
        message={`This permanently deletes all saved progress for ${mod.title} in Supabase. You'll start the module from scratch.`}
        confirmLabel="Reset"
        danger
        onCancel={() => setConfirmReset(false)}
        onConfirm={async () => {
          await resetModule()
          setConfirmReset(false)
        }}
      />

      <ConfirmDialog
        open={confirmRedo}
        title="Redo this module?"
        message="All cards become due again today, but your ease factor and correct/incorrect stats are kept."
        confirmLabel="Redo"
        onCancel={() => setConfirmRedo(false)}
        onConfirm={async () => {
          await redoModule()
          setConfirmRedo(false)
        }}
      />
    </div>
  )
}
