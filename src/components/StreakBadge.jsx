import { Flame } from 'lucide-react'

export default function StreakBadge({ streak }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-soft text-accent font-semibold text-sm shrink-0">
      <Flame size={16} className={streak > 0 ? 'fill-accent' : ''} />
      <span>
        {streak} day{streak === 1 ? '' : 's'}
      </span>
    </div>
  )
}
