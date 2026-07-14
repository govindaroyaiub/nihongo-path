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

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 inset-x-0 bg-paper/95 backdrop-blur border-t border-ink/[0.07] pb-[env(safe-area-inset-bottom)] z-40">
      <div className="flex justify-around items-stretch">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 py-2.5 flex-1 text-[10px] leading-none font-medium transition-colors ${
              isActive ? 'text-ink' : 'text-ink/40'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home size={20} strokeWidth={isActive ? 2.25 : 2} />
              Home
            </>
          )}
        </NavLink>
        {MODULES.map((mod) => {
          const Icon = ICONS[mod.id] || BookOpen
          return (
            <NavLink key={mod.id} to={`/module/${mod.id}`} className="flex-1">
              {({ isActive }) => (
                <div
                  className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] leading-none font-medium transition-colors"
                  style={{ color: isActive ? mod.color : undefined }}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.25 : 2} className={isActive ? '' : 'text-ink/40'} />
                  <span className={isActive ? '' : 'text-ink/40'}>{mod.title}</span>
                </div>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
