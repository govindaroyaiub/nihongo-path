import NaritaScene from './Narita'
import TokyoStationScene from './TokyoStation'
import ShibuyaScene from './Shibuya'
import AkihabaraScene from './Akihabara'
import AsakusaScene from './Asakusa'
import ShinjukuScene from './Shinjuku'
import HarajukuScene from './Harajuku'
import KamakuraScene from './Kamakura'
import HakoneScene from './Hakone'
import NagoyaScene from './Nagoya'
import KyotoScene from './Kyoto'
import NaraScene from './Nara'
import OsakaScene from './Osaka'
import FujiScene from './Fuji'

// Animated place scenes by unit id; places without one use the simple card.
export const SCENES = {
  'n5-hiragana': NaritaScene,
  'n5-katakana': TokyoStationScene,
  'n5-u01': ShibuyaScene,
  'n5-u02': AkihabaraScene,
  'n5-u03': AsakusaScene,
  'n5-u04': ShinjukuScene,
  'n5-u05': HarajukuScene,
  'n5-u06': KamakuraScene,
  'n5-u07': HakoneScene,
  'n5-u08': NagoyaScene,
  'n5-u09': KyotoScene,
  'n5-u10': NaraScene,
  'n5-u11': OsakaScene,
  'n5-u12': FujiScene,
}
