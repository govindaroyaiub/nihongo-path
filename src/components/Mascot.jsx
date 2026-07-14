import { useState, useEffect } from 'react'

const PLACEHOLDER = {
  idle: { bg: '#F0DFD5', fg: '#C2694A', mouth: 'M -8,4 Q 0,9 8,4' },
  celebrate: { bg: '#DCEBDF', fg: '#5A8C69', mouth: 'M -9,3 Q 0,14 9,3' },
  oops: { bg: '#F3DBDB', fg: '#C25A5A', mouth: 'M -7,7 Q 0,2 7,7' },
}

// Renders the real mascot art from /mascot/{pose}.png if it's been dropped in,
// otherwise falls back to a simple placeholder face so nothing looks broken
// in the meantime. Drop in real PNGs later with zero code changes.
export default function Mascot({ pose = 'idle', size = 96, animate = true, className = '' }) {
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    setImgFailed(false)
  }, [pose])

  const animClass = animate ? (pose === 'idle' ? 'animate-mascot-sway' : 'animate-reaction-pop') : ''

  if (imgFailed) {
    const { bg, fg, mouth } = PLACEHOLDER[pose] ?? PLACEHOLDER.idle
    return (
      <div
        className={`rounded-full flex items-center justify-center shrink-0 ${animClass} ${className}`}
        style={{ width: size, height: size, backgroundColor: bg }}
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="-20 -20 40 40">
          <circle cx="-8" cy="-4" r="3" fill={fg} />
          <circle cx="8" cy="-4" r="3" fill={fg} />
          <path d={mouth} fill="none" stroke={fg} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={`/mascot/${pose}.png`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`shrink-0 object-contain ${animClass} ${className}`}
      style={{ width: size, height: size }}
      onError={() => setImgFailed(true)}
    />
  )
}
