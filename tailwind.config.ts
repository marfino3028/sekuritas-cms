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
        // Design system "Indigo Premium" — selaras dengan web depan & mobile
        // (indigo primary + violet accent). Nama token dipertahankan agar
        // seluruh class yang ada ikut berubah otomatis.
        sidebar: {
          DEFAULT: '#312E81', // deep indigo
          hover: '#3730A3',
          active: '#1E1B4B',
          border: '#3730A3'
        },
        accent: {
          DEFAULT: '#4F46E5', // indigo
          light: '#818CF8',
          dark: '#4338CA',
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3'
        },
        gold: {
          DEFAULT: '#8B5CF6', // aksen premium = violet (bukan gold)
          light: '#A78BFA',
          dark: '#7C3AED'
        },
        // Override palet 'teal' bawaan → indigo, agar seluruh class teal-*
        // yang sudah dipakai di halaman otomatis mengadopsi warna brand.
        teal: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
          800: '#312E81',
          900: '#1E1B4B'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config
