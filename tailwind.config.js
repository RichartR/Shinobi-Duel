/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shinobi: {
          bg: '#140e0a',
          wood: '#261911',
          darkWood: '#18110c',
          parchment: '#f4ebd9',
          parchmentBorder: '#281b12',
          cinnabar: '#991b1b',
          crimson: '#dc2626',
          chakra: '#f59e0b',
          leaf: '#16a34a',
          stone: '#292524',
          sand: '#b48a5a'
        }
      },
      fontFamily: {
        sans: ['Cinzel', 'Noto Sans JP', 'system-ui', '-apple-system', 'sans-serif'],
        kanji: ['Noto Serif JP', 'serif']
      }
    },
  },
  plugins: [],
}
