/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'oklch(24% 0.015 50)',
        paper: 'oklch(98% 0.008 80)',
        accent: 'oklch(58% 0.14 40)',
        'accent-soft': 'oklch(93% 0.03 40)',
        success: 'oklch(55% 0.10 145)',
        danger: 'oklch(55% 0.13 25)',
      },
      fontFamily: {
        sans: ['Inter', '"Hiragino Sans"', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
        display: ['Fraunces', '"Hiragino Sans"', '"Noto Sans JP"', 'serif'],
      },
    },
  },
  plugins: [],
}
