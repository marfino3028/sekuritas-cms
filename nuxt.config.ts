export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  // SPA mode: gunakan routeRules, bukan ssr: false (fix Nuxt 3.21+ bug)
  routeRules: {
    '/**': { ssr: false },
  },

  app: {
    head: {
      title: 'Victoria Sekuritas — CMS Admin',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Victoria Sekuritas — CMS Admin Panel platform reksa dana' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/cms',
      // Base URL web depan (untuk menyusun link promo/referral). Kosongkan → path relatif.
      frontendBase: process.env.NUXT_PUBLIC_FRONTEND_BASE || 'http://localhost:3000'
    }
  },

  imports: {
    dirs: ['stores']
  }
})
