import { NavLink } from 'react-router-dom'
import { Home, Type, Languages, BookOpen, GraduationCap, PenTool } from 'lucide-react'
import { MODULES } from '../lib/modules'

const ICONS = {
  hiragana: Type,
  katakana: Languages,
  grammar: BookOpen,
  vocabulary: GraduationCap,
  kanji: PenTool,
}

const linkClass = ({ isActive }) =>
  `flex flex-col items-center justify-center gap-0.5 py-2.5 flex-1 text-[10px] leading-none font-medium ${
    isActive ? 'text-accent' : 'text-ink/45'
  }`

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 inset-x-0 bg-paper/95 backdrop-blur border-t border-ink/10 pb-[env(safe-area-inset-bottom)] z-40">
      <div className="flex justify-around items-stretch">
        <NavLink to="/" end className={linkClass}>
          <Home size={20} />
          Home
        </NavLink>
        {MODULES.map((mod) => {
          const Icon = ICONS[mod.id] || BookOpen
          return (
            <NavLink key={mod.id} to={`/module/${mod.id}`} className={linkClass}>
              <Icon size={20} />
              {mod.title}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
