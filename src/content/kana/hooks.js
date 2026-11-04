// "あ for あり 🐜": the way Japanese children learn kana, from an あいうえお
// chart. Each base character gets one everyday word that starts with it, with
// a picture. Katakana get loanwords, the words katakana is used for.
//
//   [word, emoji, meaning, origin]
//
// origin: the kanji the character was written from. Hiragana are fast cursive
// kanji; katakana are a piece of one.
//
// Voiced (が) and combo (きゃ) kana get a word too, plus a line on how they're
// built from a base character (see kanaHint below). A few rare ones (ぴゃ, ヂ)
// have no everyday word, so they show only how they're built. When no word
// starts with the character (を, ん, ぢ), the word shows it where it appears.

export const HOOKS = {
  // ---- hiragana ----------------------------------------------------------
  あ: ['あり', '🐜', 'ant', '安'],
  い: ['いぬ', '🐕', 'dog', '以'],
  う: ['うし', '🐄', 'cow', '宇'],
  え: ['えき', '🚉', 'station', '衣'],
  お: ['おにぎり', '🍙', 'rice ball', '於'],
  か: ['かさ', '☂️', 'umbrella', '加'],
  き: ['きつね', '🦊', 'fox', '幾'],
  く: ['くつ', '👟', 'shoes', '久'],
  け: ['けいさつ', '👮', 'police', '計'],
  こ: ['こい', '🎏', 'carp', '己'],
  さ: ['さかな', '🐟', 'fish', '左'],
  し: ['しか', '🦌', 'deer', '之'],
  す: ['すし', '🍣', 'sushi', '寸'],
  せ: ['せんせい', '🧑‍🏫', 'teacher', '世'],
  そ: ['そら', '🌤️', 'sky', '曽'],
  た: ['たこ', '🐙', 'octopus', '太'],
  ち: ['ちず', '🗺️', 'map', '知'],
  つ: ['つき', '🌕', 'moon', '川'],
  て: ['てがみ', '✉️', 'letter', '天'],
  と: ['とり', '🐦', 'bird', '止'],
  な: ['なす', '🍆', 'eggplant', '奈'],
  に: ['にんじん', '🥕', 'carrot', '仁'],
  ぬ: ['ぬいぐるみ', '🧸', 'stuffed toy', '奴'],
  ね: ['ねこ', '🐈', 'cat', '祢'],
  の: ['のこぎり', '🪚', 'saw', '乃'],
  は: ['はな', '🌸', 'flower', '波'],
  ひ: ['ひこうき', '✈️', 'airplane', '比'],
  ふ: ['ふじさん', '🗻', 'Mt. Fuji', '不'],
  へ: ['へび', '🐍', 'snake', '部'],
  ほ: ['ほし', '⭐', 'star', '保'],
  ま: ['まめ', '🫘', 'beans', '末'],
  み: ['みかん', '🍊', 'mandarin orange', '美'],
  む: ['むし', '🐞', 'bug', '武'],
  め: ['めがね', '👓', 'glasses', '女'],
  も: ['もも', '🍑', 'peach', '毛'],
  や: ['やま', '⛰️', 'mountain', '也'],
  ゆ: ['ゆき', '⛄', 'snow', '由'],
  よ: ['よる', '🌃', 'night', '与'],
  ら: ['らくだ', '🐫', 'camel', '良'],
  り: ['りんご', '🍎', 'apple', '利'],
  る: ['るすばん', '🏠', 'minding the house', '留'],
  れ: ['れいぞうこ', '🧊', 'fridge', '礼'],
  ろ: ['ろうそく', '🕯️', 'candle', '呂'],
  わ: ['わに', '🐊', 'crocodile', '和'],
  を: ['ほんをよむ', '📖', 'read a book', '遠', 'Only ever the particle "o", marking what an action is done to.'],
  ん: ['ほん', '📕', 'book', '无', 'Never starts a word; it closes one.'],

  // ---- katakana: loanwords -----------------------------------------------
  ア: ['アイス', '🍦', 'ice cream', '阿'],
  イ: ['イルカ', '🐬', 'dolphin', '伊'],
  ウ: ['ウイルス', '🦠', 'virus', '宇'],
  エ: ['エレベーター', '🛗', 'elevator', '江'],
  オ: ['オレンジ', '🍊', 'orange', '於'],
  カ: ['カメラ', '📷', 'camera', '加'],
  キ: ['キウイ', '🥝', 'kiwi', '幾'],
  ク: ['クッキー', '🍪', 'cookie', '久'],
  ケ: ['ケーキ', '🍰', 'cake', '介'],
  コ: ['コーヒー', '☕', 'coffee', '己'],
  サ: ['サッカー', '⚽', 'soccer', '散'],
  シ: ['シーフード', '🦐', 'seafood', '之'],
  ス: ['スマホ', '📱', 'smartphone', '須'],
  セ: ['セーター', '🧥', 'sweater', '世'],
  ソ: ['ソファ', '🛋️', 'sofa', '曽'],
  タ: ['タクシー', '🚕', 'taxi', '多'],
  チ: ['チーズ', '🧀', 'cheese', '千'],
  ツ: ['ツリー', '🎄', 'Christmas tree', '川'],
  テ: ['テレビ', '📺', 'TV', '天'],
  ト: ['トマト', '🍅', 'tomato', '止'],
  ナ: ['ナイフ', '🔪', 'knife', '奈'],
  ニ: ['ニンジャ', '🥷', 'ninja', '二'],
  ヌ: ['ヌードル', '🍜', 'noodles', '奴'],
  ネ: ['ネクタイ', '👔', 'necktie', '祢'],
  ノ: ['ノート', '📓', 'notebook', '乃'],
  ハ: ['ハンバーガー', '🍔', 'hamburger', '八'],
  ヒ: ['ヒーロー', '🦸', 'hero', '比'],
  フ: ['フライパン', '🍳', 'frying pan', '不'],
  ヘ: ['ヘリコプター', '🚁', 'helicopter', '部'],
  ホ: ['ホテル', '🏨', 'hotel', '保'],
  マ: ['マスク', '😷', 'mask', '末'],
  ミ: ['ミルク', '🥛', 'milk', '三'],
  ム: ['ムービー', '🎬', 'movie', '牟'],
  メ: ['メロン', '🍈', 'melon', '女'],
  モ: ['モンスター', '👾', 'monster', '毛'],
  ヤ: ['ヤシ', '🌴', 'palm tree', '也'],
  ユ: ['ユニフォーム', '🎽', 'uniform', '由'],
  ヨ: ['ヨット', '⛵', 'yacht', '与'],
  ラ: ['ラジオ', '📻', 'radio', '良'],
  リ: ['リボン', '🎀', 'ribbon', '利'],
  ル: ['ルビー', '💎', 'ruby', '流'],
  レ: ['レモン', '🍋', 'lemon', '礼'],
  ロ: ['ロボット', '🤖', 'robot', '呂'],
  ワ: ['ワイン', '🍷', 'wine', '和'],
  ヲ: ['ヲ', '📜', 'the particle o', '乎', 'Almost never used: words write the particle in hiragana, を.'],
  ン: ['ライオン', '🦁', 'lion', '尓', 'Never starts a word; it closes one.'],
  // ---- voiced, ゜ and combos: hiragana -----------------------------------
  // Hiragana words starting with ぱ-row sounds are mostly sound words
  // (ぱちぱち = clap clap), a very Japanese part of the language.
  が: ['がっこう', '🏫', 'school'],
  ぎ: ['ぎんこう', '🏦', 'bank'],
  ぐ: ['ぐるぐる', '🌀', 'round and round'],
  げ: ['げた', '🩴', 'wooden sandals'],
  ご: ['ごはん', '🍚', 'rice'],
  ざ: ['ざっし', '📰', 'magazine'],
  じ: ['じてんしゃ', '🚲', 'bicycle'],
  ず: ['ずつう', '🤕', 'headache'],
  ぜ: ['かぜ', '🌬️', 'wind', null, 'Few words start with ぜ; it often ends one.'],
  ぞ: ['ぞう', '🐘', 'elephant'],
  だ: ['だんご', '🍡', 'rice dumplings'],
  ぢ: ['はなぢ', '🩸', 'nosebleed', null, 'Sounds like じ. Written ぢ only when ち gets voiced in a compound: はな (nose) + ち (blood).'],
  づ: ['みかづき', '🌙', 'crescent moon', null, 'Sounds like ず. Written づ only when つ gets voiced in a compound: みか + つき (moon).'],
  で: ['でんわ', '📞', 'phone'],
  ど: ['どんぐり', '🌰', 'acorn'],
  ば: ['ばら', '🌹', 'rose'],
  び: ['びん', '🍾', 'bottle'],
  ぶ: ['ぶどう', '🍇', 'grapes'],
  べ: ['べんとう', '🍱', 'boxed lunch'],
  ぼ: ['ぼうし', '👒', 'hat'],
  ぱ: ['ぱちぱち', '👏', 'clap clap'],
  ぴ: ['ぴかぴか', '✨', 'sparkly'],
  ぷ: ['ぷかぷか', '🛟', 'bobbing afloat'],
  ぺ: ['ぺこぺこ', '🙇', 'bowing again and again'],
  ぽ: ['ぽかぽか', '☀️', 'nice and warm'],
  きゃ: ['きゃっきゃ', '😆', 'giggling'],
  きゅ: ['きゅうきゅうしゃ', '🚑', 'ambulance'],
  きょ: ['きょうりゅう', '🦖', 'dinosaur'],
  しゃ: ['しゃしん', '🖼️', 'photo'],
  しゅ: ['しゅくだい', '📝', 'homework'],
  しょ: ['しょうぼうしゃ', '🚒', 'fire engine'],
  ちゃ: ['ちゃわん', '🍵', 'tea bowl'],
  ちゅ: ['ちゅうしゃ', '💉', 'injection'],
  ちょ: ['ちょうちょ', '🦋', 'butterfly'],
  にゃ: ['にゃー', '😺', 'meow'],
  にゅ: ['にゅうよく', '🛀', 'taking a bath'],
  にょ: ['にょろにょろ', '🪱', 'wriggling'],
  ひゃ: ['ひゃく', '💯', 'hundred'],
  ひゅ: ['ひゅーひゅー', '💨', 'whoosh'],
  ひょ: ['ひょう', '🐆', 'leopard'],
  みゃ: ['みゃく', '💓', 'pulse'],
  みょ: ['みょうじ', '🪪', 'family name'],
  りゅ: ['りゅう', '🐉', 'dragon'],
  りょ: ['りょこう', '🧳', 'trip'],
  ぎゅ: ['ぎゅうにく', '🥩', 'beef'],
  ぎょ: ['ぎょうざ', '🥟', 'dumplings'],
  じゃ: ['じゃんけん', '✊', 'rock-paper-scissors'],
  じゅ: ['じゅう', '🔟', 'ten'],
  じょ: ['じょうず', '👍', 'good at'],
  びょ: ['びょういん', '🏥', 'hospital'],
  ぴょ: ['ぴょんぴょん', '🦘', 'hop hop'],

  // ---- voiced, ゜ and combos: katakana -----------------------------------
  ガ: ['ガソリン', '⛽', 'gasoline'],
  ギ: ['ギター', '🎸', 'guitar'],
  グ: ['グラス', '🥂', 'glass'],
  ゲ: ['ゲーム', '🎮', 'game'],
  ゴ: ['ゴリラ', '🦍', 'gorilla'],
  ザ: ['ザリガニ', '🦞', 'crayfish'],
  ジ: ['ジム', '🏋️', 'gym'],
  ズ: ['ズボン', '👖', 'trousers'],
  ゼ: ['ゼロ', '0️⃣', 'zero'],
  ゾ: ['ゾンビ', '🧟', 'zombie'],
  ダ: ['ダンス', '💃', 'dance'],
  デ: ['デパート', '🏬', 'department store'],
  ド: ['ドア', '🚪', 'door'],
  バ: ['バス', '🚌', 'bus'],
  ビ: ['ビール', '🍺', 'beer'],
  ブ: ['ブーツ', '👢', 'boots'],
  ベ: ['ベッド', '🛏️', 'bed'],
  ボ: ['ボール', '🏀', 'ball'],
  パ: ['パン', '🍞', 'bread'],
  ピ: ['ピアノ', '🎹', 'piano'],
  プ: ['プール', '🏊', 'swimming pool'],
  ペ: ['ペンギン', '🐧', 'penguin'],
  ポ: ['ポスト', '📮', 'postbox'],
  キャ: ['キャンプ', '⛺', 'camping'],
  キュ: ['キュウリ', '🥒', 'cucumber'],
  キョ: ['キョロキョロ', '👀', 'looking around'],
  シャ: ['シャツ', '👕', 'shirt'],
  シュ: ['シュークリーム', '🧁', 'cream puff'],
  ショ: ['ショッピング', '🛍️', 'shopping'],
  チャ: ['チャイム', '🔔', 'chime'],
  チュ: ['チューリップ', '🌷', 'tulip'],
  チョ: ['チョコレート', '🍫', 'chocolate'],
  ニャ: ['ニャー', '🐱', 'meow'],
  ニュ: ['ニュース', '🗞️', 'news'],
  ミュ: ['ミュージック', '🎵', 'music'],
  リュ: ['リュック', '🎒', 'backpack'],
  ジャ: ['ジャム', '🍓', 'jam'],
  ジュ: ['ジュース', '🧃', 'juice'],
  ジョ: ['ジョギング', '🏃', 'jogging'],
  ビュ: ['ビュッフェ', '🍽️', 'buffet'],
}

const SMALL_Y = { ゃ: 'ya', ゅ: 'yu', ょ: 'yo', ャ: 'ya', ュ: 'yu', ョ: 'yo' }
// ぢ/づ merged into じ/ず centuries ago.
const SAME_SOUND = { ぢ: 'じ', づ: 'ず', ヂ: 'ジ', ヅ: 'ズ' }
const VOICING = { k: 'g', s: 'z', sh: 'j', t: 'd', ch: 'j', ts: 'z', h: 'b', f: 'b' }

// The hint a teaching card shows for `card`: its picture word, and for voiced
// and combo kana, how they're built from a base one. `romajiOf` maps char → romaji.
export function kanaHint(card, romajiOf) {
  const hook = HOOKS[card.char]
  const built = card.group === 'base' ? null : builtFrom(card, romajiOf)
  if (!hook) return built
  const [word, emoji, meaning, origin, note] = hook
  return { word, emoji, meaning, origin: origin ?? undefined, note, built: built?.text, parts: built?.parts }
}

function builtFrom(card, romajiOf) {
  const base = card.group === 'yoon' ? card.char[0] : card.char.normalize('NFD')[0]
  const baseRomaji = romajiOf(base)
  if (card.group === 'yoon') {
    const small = card.char[1]
    return {
      parts: [base, small],
      text: `${base} {${baseRomaji}} + small ${small} {${SMALL_Y[small]}}, said as one beat: {${card.romaji}}.`,
    }
  }
  if (card.group === 'handakuten') {
    return { parts: [base, '゜'], text: `${base} {${baseRomaji}} + the circle ゜ turns h into p: {${card.romaji}}.` }
  }
  const from = baseRomaji.replace(/[aiueo]+$/, '')
  const twin = SAME_SOUND[card.char]
  return {
    parts: [base, '゛'],
    text: twin
      ? `${base} {${baseRomaji}} + the two dots ゛. Sounds exactly like ${twin}: {${card.romaji}}.`
      : `${base} {${baseRomaji}} + the two dots ゛ buzz the sound, ${from} → ${VOICING[from]}: {${card.romaji}}.`,
  }
}
