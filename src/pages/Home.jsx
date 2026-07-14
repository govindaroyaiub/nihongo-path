import { Link } from 'react-router-dom'
import { LogOut, ShieldCheck } from 'lucide-react'
import { useDueCards } from '../hooks/useDueCards'
import { useStreak } from '../hooks/useStreak'
import { useAuth } from '../context/AuthContext'
import ProgressBar from '../components/ProgressBar'
import StreakBadge from '../components/StreakBadge'
import Mascot from '../components/Mascot'

export default function Home() {
  const { loading, moduleStats, totalDue } = useDueCards()
  const { streak } = useStreak()
  const { isAdmin, signOut } = useAuth()

  const busiest = [...moduleStats].sort((a, b) => b.due - a.due)[0]
  const modulesWithDue = moduleStats.filter((m) => m.due > 0).length

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-10 pb-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Mascot pose="idle" size={52} />
          <div>
            <h1 className="font-display text-3xl font-medium text-ink">Nihongo Path</h1>
            {!loading && (
              <p className="text-sm text-ink/45 mt-1.5">
                {totalDue > 0 ? (
                  <>
                    <span className="font-medium text-ink/70">{totalDue}</span> cards waiting across{' '}
                    {modulesWithDue} module{modulesWithDue === 1 ? '' : 's'}
                  </>
                ) : (
                  'All caught up, come back tomorrow'
                )}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StreakBadge streak={streak} />
          {isAdmin && (
            <Link
              to="/admin"
              aria-label="Admin settings"
              className="flex items-center justify-center w-9 h-9 rounded-full text-ink/40 active:bg-ink/5 active:text-ink/70"
            >
              <ShieldCheck size={17} />
            </Link>
          )}
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            className="flex items-center justify-center w-9 h-9 rounded-full text-ink/40 active:bg-ink/5 active:text-ink/70"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      {totalDue > 0 && busiest ? (
        <Link
          to={`/module/${busiest.id}/flashcards`}
          className="inline-flex items-center gap-1.5 text-sm font-medium mt-4"
          style={{ color: busiest.color }}
        >
          Continue with {busiest.title}
          <span aria-hidden>→</span>
        </Link>
      ) : (
        <div className="mt-4" />
      )}

      <div className="mt-8">
        {moduleStats.map((mod, i) => (
          <Link
            key={mod.id}
            to={`/module/${mod.id}`}
            className={`flex items-center gap-4 py-4 -mx-2 px-2 rounded-xl active:bg-ink/[0.03] ${
              i !== 0 ? 'border-t border-ink/[0.07]' : ''
            }`}
          >
            <div
              className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-display text-xl"
              style={{ backgroundColor: `color-mix(in oklch, ${mod.color} 14%, white)`, color: mod.color }}
            >
              {mod.glyph}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-ink truncate">{mod.title}</span>
                {mod.due > 0 ? (
                  <span className="text-xs font-medium shrink-0" style={{ color: mod.color }}>
                    {mod.due} due
                  </span>
                ) : (
                  <span className="text-xs text-ink/35 shrink-0">
                    {mod.mastered}/{mod.total}
                  </span>
                )}
              </div>
              <p className="text-xs text-ink/40 mb-1.5 truncate">{mod.subtitle}</p>
              <ProgressBar value={mod.mastered} max={mod.total} color={mod.color} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
