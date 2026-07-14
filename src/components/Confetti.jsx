import { useMemo } from 'react'

const COLORS = ['#C2694A', '#5A8C69', '#5A7D8C', '#EF9F27', '#7A5A8C']

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

// Absolutely-positioned CSS burst — parent needs `position: relative`.
// No library, no cleanup needed: pieces just fall out of view and stay there.
export default function Confetti({ count = 28 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: randomBetween(5, 95),
        color: COLORS[i % COLORS.length],
        width: randomBetween(6, 11),
        delay: randomBetween(0, 250),
        duration: randomBetween(900, 1600),
        rotate: randomBetween(-90, 90),
      })),
    [count]
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            top: '-12px',
            left: `${p.left}%`,
            width: p.width,
            height: p.width * 0.4,
            backgroundColor: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}ms ease-in ${p.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  )
}
