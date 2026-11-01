import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

// Floating rounded bar, outlined like every other panel (matches the Learn top bar).
export default function PageHeader({ title, eyebrow, back = -1, right }) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-30 pt-[max(env(safe-area-inset-top),0.75rem)] pb-2 mb-3">
      <div
        className="flex items-center gap-3 rounded-full bg-surface/95 backdrop-blur-md border-[2.5px] border-outline pl-1.5 pr-4 py-1.5"
        style={{ boxShadow: '0 4px 0 0 rgb(var(--outline))' }}
      >
        <button
          type="button"
          onClick={() => navigate(back)}
          aria-label="Back"
          className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-ink bg-sunken active:translate-y-0.5"
        >
          <ChevronLeft size={24} strokeWidth={2.6} />
        </button>
        <div className="flex-1 min-w-0 leading-tight">
          {eyebrow && <p className="eyebrow text-torii truncate">{eyebrow}</p>}
          <h1 className="font-title text-lg truncate">{title}</h1>
        </div>
        {right}
      </div>
    </header>
  )
}
