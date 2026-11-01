// Chunky rounded bar with a glossy highlight. `color` is a Tailwind bg class.
export default function ProgressBar({ value, max, color = 'bg-matcha', height = 'h-4' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className={`w-full ${height} rounded-full bg-sunken overflow-hidden`}>
      <div className={`h-full rounded-full ${color} relative transition-all duration-500 ease-out`} style={{ width: `${pct}%`, minWidth: pct > 0 ? '1rem' : 0 }}>
        <span className="absolute left-2 right-2 top-[3px] h-[30%] rounded-full bg-white/35" />
      </div>
    </div>
  )
}
