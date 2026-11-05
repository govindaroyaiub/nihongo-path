/** @type {import('tailwindcss').Config} */
// Every color is a CSS variable (see index.css), so light/dark themes swap in one place.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        sunken: v('sunken'),
        ink: v('ink'),
        line: v('line'),
        outline: v('outline'),
        // brand
        torii: v('torii'),
        'torii-deep': v('torii-deep'),
        sky: v('sky'),
        'sky-deep': v('sky-deep'),
        matcha: v('matcha'),
        'matcha-deep': v('matcha-deep'),
        sun: v('sun'),
        'sun-deep': v('sun-deep'),
        grape: v('grape'),
        'grape-deep': v('grape-deep'),
        sakura: v('sakura'),
        'sakura-deep': v('sakura-deep'),
        // legacy aliases used across components
        paper: v('bg'),
        card: v('surface'),
        accent: v('torii'),
        'accent-soft': v('torii-soft'),
        indigo: v('sky-deep'),
        'indigo-soft': v('sky-soft'),
        success: v('matcha-deep'),
        'success-soft': v('matcha-soft'),
        danger: v('torii-deep'),
        gold: v('sun-deep'),
      },
      fontFamily: {
        sans: ['"M PLUS Rounded 1c"', '"Hiragino Maru Gothic ProN"', '"Hiragino Sans"', 'system-ui', 'sans-serif'],
        jp: ['"M PLUS Rounded 1c"', '"Hiragino Maru Gothic ProN"', '"Hiragino Sans"', 'sans-serif'],
        // Anime title-card / manga sound-effect lettering.
        title: ['"Dela Gothic One"', '"M PLUS Rounded 1c"', 'system-ui', 'sans-serif'],
        // Textbook-style strokes: shows learners how characters are really written.
        hand: ['"Klee One"', '"Hiragino Mincho ProN"', '"Yu Mincho"', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
