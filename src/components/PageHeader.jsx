import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function PageHeader({ title, eyebrow, back = -1, right }) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:mx-0 bg-bg/90 backdrop-blur-md px-2 sm:px-4 lg:px-0 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 mb-3 flex items-center gap-2">
      <button
        type="button"
        onClick={() => navigate(back)}
        aria-label="Back"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-ink border-[2.5px] border-outline bg-surface active:translate-y-0.5"
      >
        <ChevronLeft size={24} />
      </button>
      <div className="flex-1 min-w-0">
        {eyebrow && <p className="eyebrow text-torii">{eyebrow}</p>}
        <h1 className="font-title text-xl truncate">{title}</h1>
      </div>
      {right}
    </header>
  )
}
