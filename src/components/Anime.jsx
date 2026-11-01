import { useMemo } from 'react'

// Drifting sakura petals. Fixed, behind content, pointer-events off.
export function Sakura({ count = 12 }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 8 + Math.random() * 9,
        duration: 9 + Math.random() * 9,
        delay: -Math.random() * 18,
        drift: `${(Math.random() - 0.5) * 30}vw`,
        spin: `${360 + Math.random() * 540}deg`,
      })),
    [count]
  )
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {petals.map((p) => (
        <svg
          key={p.id}
          viewBox="0 0 20 20"
          width={p.size}
          height={p.size}
          className="absolute -top-4"
          style={{
            left: `${p.left}%`,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
            '--drift': p.drift,
            '--spin': p.spin,
          }}
        >
          <path d="M10 1 C15 4 17 10 10 19 C3 10 5 4 10 1 Z M10 1 L10 5" fill="#ffb7cf" stroke="#f08ab0" strokeWidth="1" />
        </svg>
      ))}
    </div>
  )
}

// Spiky manga burst behind a sound effect.
function burstPath(points = 14, outer = 50, inner = 36) {
  const d = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (Math.PI * i) / points - Math.PI / 2
    d.push(`${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`)
  }
  return `M${d.join('L')}Z`
}
const BURST = burstPath()

// Big outlined Japanese sound effect: 正解！ / ドンマイ！ / すごい！
export function SfxBurst({ text, color = 'sun', size = 150, className = '' }) {
  const fill = { sun: 'rgb(var(--sun))', torii: 'rgb(var(--torii))', sky: 'rgb(var(--sky))', matcha: 'rgb(var(--matcha))', sakura: 'rgb(var(--sakura))' }[color]
  return (
    <div className={`relative flex items-center justify-center animate-sfx-pop ${className}`} style={{ width: size, height: size * 0.62 }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <path d={BURST} fill={fill} stroke="rgb(var(--outline))" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <span className="sfx relative text-white whitespace-nowrap" style={{ fontSize: size * 0.2 }}>
        {text}
      </span>
    </div>
  )
}

// Twinkling four-point sparkles scattered over a container (parent: relative).
export function Sparkles({ count = 6, color = '#ffd23f' }) {
  const stars = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ id: i, left: 5 + Math.random() * 90, top: 5 + Math.random() * 90, size: 10 + Math.random() * 14, delay: Math.random() * 2 })),
    [count]
  )
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {stars.map((s) => (
        <svg
          key={s.id}
          viewBox="0 0 20 20"
          width={s.size}
          height={s.size}
          className="absolute"
          style={{ left: `${s.left}%`, top: `${s.top}%`, animation: `sparkle 2.2s ease-in-out ${s.delay}s infinite` }}
        >
          <path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0 Z" fill={color} />
        </svg>
      ))}
    </div>
  )
}

// Fluffy anime cloud, for sky scenes.
export function Cloud({ className = '', style }) {
  return (
    <svg viewBox="0 0 120 50" className={className} style={style} aria-hidden="true">
      <path
        d="M14 44 C2 44 2 28 14 28 C14 14 34 10 40 22 C46 6 74 6 78 22 C88 14 104 20 100 32 C114 32 114 44 102 44 Z"
        fill="#fff"
        stroke="rgb(var(--outline))"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
