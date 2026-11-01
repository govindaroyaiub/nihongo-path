import { NavLink } from 'react-router-dom'
import { Map, Repeat, Dumbbell, Settings, Stamp } from 'lucide-react'
import { useStats } from './Stats'

const TABS = [
  { to: '/', label: 'Learn', icon: Map, end: true, color: 'text-torii', bg: 'bg-torii/10 border-torii/40' },
  { to: '/review', label: 'Review', icon: Repeat, badge: true, color: 'text-sky', bg: 'bg-sky/10 border-sky/40' },
  { to: '/map', label: 'Stamps', icon: Stamp, color: 'text-sakura-deep', bg: 'bg-sakura/15 border-sakura/50' },
  { to: '/practice', label: 'Practice', icon: Dumbbell, color: 'text-matcha', bg: 'bg-matcha/10 border-matcha/40' },
  { to: '/settings', label: 'Settings', icon: Settings, color: 'text-grape', bg: 'bg-grape/10 border-grape/40' },
]

function Badge({ n }) {
  if (!n) return null
  return (
    <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-torii text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-bg">
      {n > 99 ? '99+' : n}
    </span>
  )
}

// Phones and small tablets: a tab bar along the bottom.
export function BottomNav() {
  const { due } = useStats()
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t-2 border-line pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-xl mx-auto flex justify-around px-2 py-1.5">
        {TABS.map(({ to, label, icon: Icon, end, badge, color, bg }) => (
          <NavLink key={to} to={to} end={end} className="flex-1">
            {({ isActive }) => (
              <div className={`mx-1 flex flex-col items-center gap-0.5 py-1.5 rounded-2xl border-2 transition-colors ${isActive ? `${bg} ${color}` : 'border-transparent text-ink/40'}`}>
                <span className="relative">
                  <Icon size={23} strokeWidth={isActive ? 2.6 : 2.2} />
                  {badge && <Badge n={due} />}
                </span>
                <span className="text-[11px] font-extrabold">{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

// Laptops and desktops: a fixed rail on the left.
export function SideNav() {
  const { due } = useStats()
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 xl:w-72 flex-col border-r-2 border-line bg-bg/80 backdrop-blur px-4 py-6 z-30">
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <span className="font-hand text-3xl text-torii leading-none">道</span>
        <div className="leading-tight">
          <p className="font-extrabold text-xl">Nihongo Path</p>
          <p className="text-xs text-ink/45 font-bold">にほんごの みち</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1.5">
        {TABS.map(({ to, label, icon: Icon, end, badge, color, bg }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-2xl border-2 font-extrabold uppercase tracking-wide text-[15px] transition-colors ${
                isActive ? `${bg} ${color}` : 'border-transparent text-ink/55 hover:bg-sunken'
              }`
            }
          >
            <span className="relative">
              <Icon size={24} strokeWidth={2.4} />
              {badge && <Badge n={due} />}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
