import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        // Warna brand ASLI Victoria Sekuritas — merah #A40001 + netral hangat.
        // Nama token dipertahankan agar seluruh class ikut berubah.
        sidebar: {
          DEFAULT: '#7D0001', // merah tua (sidebar gelap)
          hover: '#8F0001',
          active: '#4A0000',
          border: '#8F0001'
        },
        accent: {
          DEFAULT: '#A40001', // merah brand (tombol/primary)
          light: '#C85155',
          dark: '#8F0001',
          50: '#FBEAEA',
          100: '#F6D0D1',
          500: '#A40001',
          600: '#8F0001',
          700: '#7D0001'
        },
        gold: {
          DEFAULT: '#C67177', // aksen rose (dari logo), dulu "gold"
          light: '#D59997',
          dark: '#A0474E'
        },
        // Override palet 'teal' bawaan → merah Victoria (jaring pengaman kelas teal-*).
        teal: {
          50:  '#FBEAEA',
          100: '#F6D0D1',
          200: '#EBA6A8',
          300: '#DE7F81',
          400: '#C85155',
          500: '#A40001',
          600: '#8F0001',
          700: '#7D0001',
          800: '#630001',
          900: '#4A0000'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config
