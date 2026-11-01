// The path is framed as a trip across Japan: each unit is a stop. Purely
// presentational — the place just gives every unit its own identity and color.
const STOPS = {
  'n5-hiragana': { place: 'Narita Airport', jp: '成田', emoji: '✈️', color: 'sky' },
  'n5-katakana': { place: 'Tokyo Station', jp: '東京駅', emoji: '🚄', color: 'grape' },
  'n5-u01': { place: 'Shibuya', jp: '渋谷', emoji: '🚦', color: 'torii' },
  'n5-u02': { place: 'Akihabara', jp: '秋葉原', emoji: '🎮', color: 'sky' },
  'n5-u03': { place: 'Asakusa', jp: '浅草', emoji: '🏮', color: 'sun' },
  'n5-u04': { place: 'Shinjuku', jp: '新宿', emoji: '🏙️', color: 'grape' },
  'n5-u05': { place: 'Harajuku', jp: '原宿', emoji: '🛍️', color: 'sakura' },
  'n5-u06': { place: 'Kamakura', jp: '鎌倉', emoji: '🛕', color: 'matcha' },
  'n5-u07': { place: 'Hakone', jp: '箱根', emoji: '♨️', color: 'torii' },
  'n5-u08': { place: 'Nagoya', jp: '名古屋', emoji: '🏯', color: 'sun' },
  'n5-u09': { place: 'Kyoto', jp: '京都', emoji: '⛩️', color: 'torii' },
  'n5-u10': { place: 'Nara', jp: '奈良', emoji: '🦌', color: 'matcha' },
  'n5-u11': { place: 'Osaka', jp: '大阪', emoji: '🐙', color: 'sky' },
  'n5-u12': { place: 'Mt. Fuji', jp: '富士山', emoji: '🗻', color: 'grape' },
}

const CYCLE = ['torii', 'sky', 'matcha', 'sun', 'grape', 'sakura']

export function stopFor(unit) {
  return STOPS[unit.id] ?? { place: unit.title, jp: '', emoji: '📍', color: CYCLE[(unit.order ?? 0) % CYCLE.length] }
}

// Tailwind needs literal class names, so map color keys to full classes here.
export const COLOR = {
  torii: { bg: 'bg-torii', text: 'text-torii', soft: 'bg-torii/15', lip: 'rgb(var(--torii-deep))', ring: 'ring-torii/30' },
  sky: { bg: 'bg-sky', text: 'text-sky', soft: 'bg-sky/15', lip: 'rgb(var(--sky-deep))', ring: 'ring-sky/30' },
  matcha: { bg: 'bg-matcha', text: 'text-matcha', soft: 'bg-matcha/15', lip: 'rgb(var(--matcha-deep))', ring: 'ring-matcha/30' },
  sun: { bg: 'bg-sun', text: 'text-sun-deep', soft: 'bg-sun/20', lip: 'rgb(var(--sun-deep))', ring: 'ring-sun/30' },
  grape: { bg: 'bg-grape', text: 'text-grape', soft: 'bg-grape/15', lip: 'rgb(var(--grape-deep))', ring: 'ring-grape/30' },
  sakura: { bg: 'bg-sakura', text: 'text-sakura-deep', soft: 'bg-sakura/15', lip: 'rgb(var(--sakura-deep))', ring: 'ring-sakura/30' },
}
