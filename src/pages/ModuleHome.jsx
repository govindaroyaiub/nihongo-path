import { useState } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { ChevronLeft, RotateCcw, Trash2, Layers, PencilLine } from 'lucide-react'
import { getModule } from '../lib/modules'
import { useProgress } from '../hooks/useProgress'
import ProgressBar from '../components/ProgressBar'
import ConfirmDialog from '../components/ConfirmDialog'

export default function ModuleHome() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)
  const { loading, dueCards, masteredCount, totalCount, resetModule, redoModule } = useProgress(
    moduleId,
    mod?.cards ?? []
  )
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmRedo, setConfirmRedo] = useState(false)

  if (!mod) return <Navigate to="/" replace />

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6">
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="Back to home"
        className="flex items-center justify-center -ml-2 -mt-1 mb-4 w-10 h-10 rounded-full text-ink/50 active:bg-ink/5 active:text-ink/80"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div
          className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-display text-2xl"
          style={{ backgroundColor: `color-mix(in oklch, ${mod.color} 14%, white)`, color: mod.color }}
        >
          {mod.glyph}
        </div>
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">{mod.title}</h1>
          <p className="text-sm text-ink/45">{mod.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-ink/60">
          {masteredCount}/{totalCount} mastered
        </span>
        <span className="font-medium" style={{ color: mod.color }}>
          {loading ? '—' : dueCards.length} due today
        </span>
      </div>
      <ProgressBar value={masteredCount} max={totalCount} color={mod.color} />

      <div className="flex flex-col gap-3 mt-8 mb-6">
        <Link
          to={`/module/${moduleId}/flashcards`}
          className="flex items-center justify-center gap-2 text-white rounded-2xl px-5 py-4 font-medium active:scale-[0.98] transition-transform"
          style={{ backgroundColor: mod.color }}
        >
          <Layers size={20} />
          Study flashcards
        </Link>
        <Link
          to={`/module/${moduleId}/quiz`}
          className="flex items-center justify-center gap-2 bg-white border-2 border-ink/10 rounded-2xl px-5 py-4 font-medium text-ink/80 active:scale-[0.98] transition-transform"
        >
          <PencilLine size={20} />
          Take a quiz
        </Link>
      </div>

      <div className="flex items-center gap-1 pt-4 border-t border-ink/[0.07]">
        <button
          type="button"
          onClick={() => setConfirmRedo(true)}
          className="flex items-center gap-1.5 text-xs text-ink/45 rounded-full px-3 py-2 active:bg-ink/5"
        >
          <RotateCcw size={14} />
          Redo module
        </button>
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="flex items-center gap-1.5 text-xs text-danger/70 rounded-full px-3 py-2 active:bg-danger/5"
        >
          <Trash2 size={14} />
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
