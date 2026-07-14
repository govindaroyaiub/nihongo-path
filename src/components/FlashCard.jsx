import { useRef, useState } from 'react'
import { Check, X, Volume2 } from 'lucide-react'

const SWIPE_THRESHOLD = 90
const TAP_THRESHOLD = 6
const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'

const faceStyle = {
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
}

export default function FlashCard({ front, back, flipped, onFlip, onSwipe, onReplay }) {
  const [dragX, setDragX] = useState(0)
  const dragging = useRef(false)
  const startX = useRef(0)

  function handlePointerDown(e) {
    dragging.current = true
    startX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e) {
    if (!dragging.current) return
    setDragX(e.clientX - startX.current)
  }

  function handlePointerUp() {
    if (!dragging.current) return
    dragging.current = false

    if (dragX > SWIPE_THRESHOLD) {
      onSwipe('correct')
    } else if (dragX < -SWIPE_THRESHOLD) {
      onSwipe('incorrect')
    } else if (Math.abs(dragX) < TAP_THRESHOLD) {
      onFlip()
    }
    setDragX(0)
  }

  const rotate = dragX / 14

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div
        className="relative w-full aspect-[3/4] max-w-sm select-none touch-none cursor-grab active:cursor-grabbing"
        style={{
          perspective: '1600px',
          transform: `translateX(${dragX}px) rotate(${rotate}deg)`,
          transition: dragging.current ? 'none' : `transform 300ms ${EASE_OUT_EXPO}`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: `transform 500ms ${EASE_OUT_EXPO}`,
          }}
        >
          <div
            className="absolute inset-0 rounded-3xl border-2 border-ink/10 bg-white shadow-sm flex items-center justify-center px-6 text-center"
            style={faceStyle}
          >
            {front}
          </div>
          <div
            className="absolute inset-0 rounded-3xl border-2 border-ink/10 bg-white shadow-sm flex items-center justify-center px-6 text-center"
            style={{ ...faceStyle, transform: 'rotateY(180deg)' }}
          >
            {back}
          </div>
        </div>

        {dragX > 20 && (
          <div
            className="absolute inset-0 rounded-3xl bg-success/10 border-2 border-success pointer-events-none"
            style={{ opacity: Math.min(1, dragX / SWIPE_THRESHOLD) }}
          />
        )}
        {dragX < -20 && (
          <div
            className="absolute inset-0 rounded-3xl bg-danger/10 border-2 border-danger pointer-events-none"
            style={{ opacity: Math.min(1, -dragX / SWIPE_THRESHOLD) }}
          />
        )}
        {dragX > 20 && (
          <div className="absolute top-4 right-4 text-success pointer-events-none">
            <Check size={32} strokeWidth={3} />
          </div>
        )}
        {dragX < -20 && (
          <div className="absolute top-4 left-4 text-danger pointer-events-none">
            <X size={32} strokeWidth={3} />
          </div>
        )}

        {onReplay && (
          <button
            type="button"
            aria-label="Replay pronunciation"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              onReplay()
            }}
            className="absolute bottom-4 right-4 p-2.5 rounded-full bg-ink/5 text-ink/60 active:bg-ink/10"
          >
            <Volume2 size={20} />
          </button>
        )}
      </div>
      <p className="text-xs text-ink/45 px-6 text-center">
        Tap to flip · swipe right if you knew it, left if you didn't
      </p>
    </div>
  )
}
