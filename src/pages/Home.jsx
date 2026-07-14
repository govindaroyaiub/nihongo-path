import { Link } from 'react-router-dom'
import { useDueCards } from '../hooks/useDueCards'
import { useStreak } from '../hooks/useStreak'
import ProgressBar from '../components/ProgressBar'
import StreakBadge from '../components/StreakBadge'

export default function Home() {
  const { loading, moduleStats, totalDue } = useDueCards()
  const { streak } = useStreak()

  return (
    <div className="flex-1 overflow-y-auto px-5 pt-8 pb-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Nihongo Path</h1>
          <p className="text-sm text-ink/50">Keep the streak alive</p>
        </div>
        <StreakBadge streak={streak} />
      </header>

      <div className="rounded-3xl bg-accent text-white px-6 py-5 mb-8 shadow-sm">
        <p className="text-sm opacity-80">Cards due today</p>
        <p className="text-4xl font-semibold mt-1">{loading ? '—' : totalDue}</p>
        <p className="text-sm opacity-80 mt-1">
          {totalDue > 0 ? 'Open a module below to start reviewing' : "You're all caught up"}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {moduleStats.map((mod) => (
          <Link
            key={mod.id}
            to={`/module/${mod.id}`}
            className="block bg-white rounded-2xl border border-ink/10 p-4 active:bg-ink/5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-ink">{mod.title}</span>
              <span className="text-xs text-ink/45">
                {mod.mastered}/{mod.total} mastered
              </span>
            </div>
            <ProgressBar value={mod.mastered} max={mod.total} color={mod.color} />
            {mod.due > 0 && (
              <p className="text-xs font-medium mt-2" style={{ color: mod.color }}>
                {mod.due} due today
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
