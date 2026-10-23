/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        naruto: {
          DEFAULT: '#FA9427',
          dark: '#E77100',
          light: '#FFB057',
        },
        oro: {
          DEFAULT: '#FFE69F',
          dark: '#F59E0B',
          deep: '#D97706',
        },
        shinobi: {
          bg: '#FA9427',
          orange: '#FA9427',
          darkOrange: '#E77100',
          wood: '#261911',
          darkWood: '#18110c',
          parchment: '#FFFDF5',
          parchmentBorder: '#111111',
          cinnabar: '#c5221f',
          crimson: '#dc2626',
          chakra: '#00A3FF',
          leaf: '#16a34a',
          stone: '#111111',
          sand: '#E5D3B3'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans JP"', 'system-ui', '-apple-system', 'sans-serif'],
        impact: ['Bebas Neue', 'Oswald', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        kanji: ['Noto Serif JP', 'serif']
      }
    },
  },
  plugins: [],
}
