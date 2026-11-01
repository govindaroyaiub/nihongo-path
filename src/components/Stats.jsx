import { Link } from 'react-router-dom'
import { Flame, Zap, Repeat, Trophy } from 'lucide-react'
import { useStore, xpToday, xpTotal, today } from '../lib/store'
import { streakFrom, dueItemIds } from '../lib/progress'

export function useStats() {
  const log = useStore((s) => s.log)
  const srs = useStore((s) => s.srs)
  const goal = useStore((s) => s.settings.dailyGoal)
  return {
    streak: streakFrom(log),
    xp: xpToday(log),
    total: xpTotal(log),
    goal,
    due: dueItemIds(srs).length,
    learned: Object.keys(srs).length,
    log,
  }
}

// Compact pill row for the mobile header.
export function StatPills() {
  const { streak, xp, goal, due } = useStats()
  return (
    <div className="flex items-center gap-1.5">
      <Pill icon={Flame} value={streak} className="text-torii" filled={streak > 0} label="day streak" />
      <Pill icon={Zap} value={`${xp}/${goal}`} className="text-sun-deep" filled={xp >= goal} label="XP today" />
      {due > 0 && (
        <Link to="/review" aria-label={`${due} reviews due`}>
          <Pill icon={Repeat} value={due} className="text-sky" />
        </Link>
      )}
    </div>
  )
}

function Pill({ icon: Icon, value, className, filled, label }) {
  return (
    <span className={`flex items-center gap-1 px-2 py-1 rounded-xl font-extrabold text-sm ${className}`} title={label}>
      <Icon size={18} strokeWidth={2.6} className={filled ? 'fill-current' : ''} />
      <span className="tabular-nums">{value}</span>
    </span>
  )
}

export function GoalRing({ value, max, size = 64, stroke = 7, children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(1, max ? value / max : 0)
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--line))" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgb(var(--sun))"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

function lastSevenDays(log) {
  const days = []
  const d = new Date()
  d.setDate(d.getDate() - 6)
  for (let i = 0; i < 7; i++) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    days.push({ key, label: 'SMTWTFS'[d.getDay()], active: Boolean(log[key]), today: key === today() })
    d.setDate(d.getDate() + 1)
  }
  return days
}

export function DailyGoalCard() {
  const { xp, goal } = useStats()
  const done = xp >= goal
  return (
    <div className="panel p-5 flex items-center gap-4">
      <GoalRing value={xp} max={goal}>
        <Zap size={24} strokeWidth={2.6} className={`text-sun-deep ${done ? 'fill-current' : ''}`} />
      </GoalRing>
      <div>
        <p className="eyebrow text-ink/40">Daily goal</p>
        <p className="font-extrabold text-xl tabular-nums">
          {xp} <span className="text-ink/35">/ {goal} XP</span>
        </p>
        <p className="text-sm text-ink/55 font-bold">{done ? 'Goal reached! 🎉' : `${goal - xp} XP to go`}</p>
      </div>
    </div>
  )
}

export function StreakCard() {
  const { streak, log } = useStats()
  return (
    <div className="panel p-5">
      <div className="flex items-center gap-3">
        <Flame size={34} strokeWidth={2.4} className={`text-torii ${streak > 0 ? 'fill-torii/80' : ''}`} />
        <div>
          <p className="font-extrabold text-xl">
            {streak} day{streak === 1 ? '' : 's'}
          </p>
          <p className="text-sm text-ink/55 font-bold">{streak > 0 ? 'Keep the fire going!' : 'Study today to start a streak'}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        {lastSevenDays(log).map((d) => (
          <div key={d.key} className="flex flex-col items-center gap-1.5">
            <span className={`text-[11px] font-bold ${d.today ? 'text-torii' : 'text-ink/35'}`}>{d.label}</span>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center ${d.active ? 'bg-torii text-white' : 'bg-sunken'}`}>
              {d.active && <Flame size={14} strokeWidth={3} className="fill-current" />}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReviewCard() {
  const { due, learned } = useStats()
  return (
    <div className="panel p-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-sky/15 text-sky flex items-center justify-center">
          <Repeat size={22} strokeWidth={2.6} />
        </div>
        <div className="flex-1">
          <p className="font-extrabold text-lg">{due > 0 ? `${due} to review` : 'Reviews clear'}</p>
          <p className="text-sm text-ink/55 font-bold">{learned} items learned</p>
        </div>
      </div>
      {due > 0 && (
        <Link to="/review/session" className="btn-sky w-full py-3 mt-4 text-sm">
          Review now
        </Link>
      )}
    </div>
  )
}

export function XpTotalCard() {
  const { total } = useStats()
  return (
    <div className="panel p-5 flex items-center gap-3">
      <Trophy size={28} className="text-sun-deep" strokeWidth={2.4} />
      <div>
        <p className="font-extrabold text-lg tabular-nums">{total.toLocaleString()} XP</p>
        <p className="text-sm text-ink/55 font-bold">earned all-time</p>
      </div>
    </div>
  )
}
