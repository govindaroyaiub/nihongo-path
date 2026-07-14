/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#2b2a33',
        paper: '#faf9f6',
        accent: '#c2694a',
        'accent-soft': '#f0dfd5',
        success: '#5a8c69',
        danger: '#c25a5a',
      },
      fontFamily: {
        sans: ['"Hiragino Sans"', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
