// Kitsu, the fox guide, drawn chibi-anime style: ink outlines, cel shading,
// huge glossy eyes. Pure SVG so it's crisp on any screen.
// Poses: idle · celebrate · oops · think · wave.
const INK = '#261e3e'
const FUR = '#ff8f3f'
const FUR_SHADE = '#e8682a'
const CREAM = '#fff6ea'
const CREAM_SHADE = '#f3dcc4'

function AnimeEye({ cx, cy, look = 0 }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="7.5" ry="9.5" fill={INK} />
      <ellipse cx={cx + look} cy={cy + 2} rx="5.6" ry="7" fill="url(#iris)" />
      <ellipse cx={cx + look} cy={cy + 3.5} rx="2.6" ry="3.2" fill={INK} />
      {/* the two anime highlights */}
      <ellipse cx={cx - 2.4 + look} cy={cy - 3.6} rx="2.6" ry="3.2" fill="#fff" />
      <circle cx={cx + 2.8 + look} cy={cy + 4.6} r="1.3" fill="#fff" />
      {/* little outer lash flick (pointing outward keeps the face friendly) */}
      <path
        d={cx < 50 ? `M${cx - 6} ${cy - 7} L${cx - 10} ${cy - 10}` : `M${cx + 6} ${cy - 7} L${cx + 10} ${cy - 10}`}
        stroke={INK}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </g>
  )
}

function Eyes({ pose }) {
  if (pose === 'celebrate') {
    return (
      <g fill="none" stroke={INK} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M29 58 L36 52 L43 58" />
        <path d="M57 58 L64 52 L71 58" />
      </g>
    )
  }
  if (pose === 'oops') {
    return (
      <g stroke={INK} strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M30 52 L42 60 M42 52 L30 60" />
        <path d="M58 52 L70 60 M70 52 L58 60" />
      </g>
    )
  }
  const look = pose === 'think' ? 2 : 0
  return (
    <g style={{ animation: pose === 'idle' || pose === 'wave' ? 'blink 4.5s infinite' : undefined, transformOrigin: '50px 56px' }}>
      <AnimeEye cx={36} cy={56} look={look} />
      <AnimeEye cx={64} cy={56} look={look} />
    </g>
  )
}

const MOUTH = {
  idle: <path d="M44 70 Q50 76 56 70" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  wave: <path d="M44 70 Q50 78 56 70 Z" fill="#ff6f7f" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />,
  celebrate: (
    <g>
      <path d="M41 68 Q50 84 59 68 Z" fill="#ff6f7f" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M44 69 L56 69" stroke="#fff" strokeWidth="2" />
    </g>
  ),
  oops: <path d="M43 74 Q46 70 50 74 Q54 70 57 74" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />,
  think: <ellipse cx="53" cy="72" rx="2.4" ry="2" fill={INK} />,
}

const ANIM = { idle: 'animate-bob', wave: 'animate-bob', celebrate: 'animate-jump', oops: 'animate-wiggle', think: '' }

export default function Mascot({ pose = 'idle', size = 96, animate = true, className = '' }) {
  const p = MOUTH[pose] ? pose : 'idle'
  return (
    <div className={`shrink-0 ${animate ? ANIM[p] : ''} ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 100 100" width={size} height={size} overflow="visible">
        <defs>
          <linearGradient id="iris" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a2a6e" />
            <stop offset="0.6" stopColor="#7a4cff" />
            <stop offset="1" stopColor="#ffb0e0" />
          </linearGradient>
        </defs>
        <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
          {/* tail */}
          <g style={{ transformOrigin: '76px 88px', animation: animate ? 'tail 1.8s ease-in-out infinite' : undefined }}>
            <path d="M72 90 C96 90 104 62 90 50 C88 68 80 76 68 80 Z" fill={FUR} />
            <path d="M90 50 C98 58 98 70 93 76 C89 68 88 60 90 50 Z" fill={CREAM} />
          </g>
          {/* body */}
          <path d="M30 96 C30 80 40 76 50 76 C60 76 70 80 70 96 Z" fill={FUR} />
          <path d="M42 96 C42 86 46 82 50 82 C54 82 58 86 58 96 Z" fill={CREAM} />
          {/* ears */}
          <path d="M16 46 L20 6 L46 30 Z" fill={FUR} />
          <path d="M84 46 L80 6 L54 30 Z" fill={FUR} />
          <path d="M22 36 L24 16 L37 29 Z" fill="#ff9ec4" strokeWidth="0" />
          <path d="M78 36 L76 16 L63 29 Z" fill="#ff9ec4" strokeWidth="0" />
          {/* head (big chibi proportions) */}
          <path d="M10 52 C10 30 28 22 50 22 C72 22 90 30 90 52 C90 72 72 84 50 84 C28 84 10 72 10 52 Z" fill={FUR} />
        </g>
        {/* cel shade on the lower head */}
        <path d="M12 58 C16 74 32 82 50 82 C68 82 84 74 88 58 C80 70 66 76 50 76 C34 76 20 70 12 58 Z" fill={FUR_SHADE} opacity="0.55" />
        {/* cheeks / muzzle */}
        <path d="M18 62 C28 60 40 64 50 68 C60 64 72 60 82 62 C80 76 66 84 50 84 C34 84 20 76 18 62 Z" fill={CREAM} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M24 72 C32 80 42 82 50 82 C58 82 68 80 76 72 C68 78 58 80 50 80 C42 80 32 78 24 72 Z" fill={CREAM_SHADE} />
        {/* hair tuft + kitsune forehead mark */}
        <path d="M40 24 Q46 14 50 24 Q54 14 60 24 Q55 30 50 28 Q45 30 40 24 Z" fill={FUR} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M46 36 Q50 29 54 36 Q50 40 46 36 Z" fill="#ff4d5e" />
        {/* blush with anime hatch lines */}
        <g opacity={p === 'oops' ? 0.3 : 0.85}>
          <ellipse cx="24" cy="66" rx="6.5" ry="3.6" fill="#ff8fb3" />
          <ellipse cx="76" cy="66" rx="6.5" ry="3.6" fill="#ff8fb3" />
          <path d="M21 64.5 l2 2.5 M24.5 64.5 l2 2.5 M73 64.5 l2 2.5 M76.5 64.5 l2 2.5" stroke="#e85d8d" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        <Eyes pose={p} />
        {/* nose */}
        <path d="M47.5 65 Q50 63 52.5 65 Q50 68 47.5 65 Z" fill={INK} />
        {MOUTH[p]}

        {/* pose extras */}
        {p === 'oops' && <path d="M84 30 Q90 40 84 46 Q78 40 84 30 Z" fill="#7cc7ff" stroke={INK} strokeWidth="2" />}
        {p === 'think' && (
          <g fill="#fff" stroke={INK} strokeWidth="2">
            <circle cx="88" cy="24" r="3" />
            <circle cx="95" cy="12" r="5" />
          </g>
        )}
        {p === 'celebrate' && (
          <g fill="#ffd23f" stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
            <path d="M4 22 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" />
            <path d="M94 8 l2.2 5 5 2.2 -5 2.2 -2.2 5 -2.2 -5 -5 -2.2 5 -2.2 Z" />
            <path d="M92 70 l1.6 3.6 3.6 1.6 -3.6 1.6 -1.6 3.6 -1.6 -3.6 -3.6 -1.6 3.6 -1.6 Z" />
          </g>
        )}
        {p === 'wave' && (
          <g style={{ transformOrigin: '80px 84px', animation: animate ? 'wiggle 1.2s ease-in-out infinite' : undefined }}>
            <path d="M74 84 C84 82 90 74 90 66" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
            <path d="M74 84 C84 82 90 74 90 66" fill="none" stroke={FUR} strokeWidth="6" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  )
}

// Kitsu with a manga speech bubble — encouragement and tips.
export function MascotSays({ pose = 'idle', size = 64, children, className = '' }) {
  return (
    <div className={`flex items-end gap-2 ${className}`}>
      <Mascot pose={pose} size={size} />
      <div className="relative bg-surface border-[2.5px] border-outline rounded-2xl px-4 py-2.5 text-[15px] font-bold leading-snug mb-4">
        <span className="absolute -left-[10px] bottom-3 w-4 h-4 rotate-45 bg-surface border-l-[2.5px] border-b-[2.5px] border-outline" />
        <span className="relative">{children}</span>
      </div>
    </div>
  )
}
