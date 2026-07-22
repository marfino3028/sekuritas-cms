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
        // Brand Victoria Sekuritas — navy tepercaya + emas premium
        sidebar: {
          DEFAULT: '#0B2A5B',
          hover: '#123A72',
          active: '#0A1F44',
          border: '#123A72'
        },
        accent: {
          DEFAULT: '#1E56C9',
          light: '#4C7EE8',
          dark: '#164AAE',
          50: '#eaf0fc',
          100: '#cddbf7',
          500: '#1E56C9',
          600: '#164AAE',
          700: '#0F3A8C'
        },
        gold: {
          DEFAULT: '#F5B301',
          light: '#FFCB3D',
          dark: '#D69A00'
        },
        // Override palet 'teal' bawaan → biru Victoria, agar seluruh class teal-*
        // yang sudah dipakai di halaman otomatis mengadopsi warna brand.
        teal: {
          50:  '#eaf0fc',
          100: '#cddbf7',
          200: '#a9c2f0',
          300: '#7ea3e6',
          400: '#4C7EE8',
          500: '#1E56C9',
          600: '#164AAE',
          700: '#0F3A8C',
          800: '#0B2A5B',
          900: '#0A1F44'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config
