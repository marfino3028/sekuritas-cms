export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  // SPA mode: gunakan routeRules, bukan ssr: false (fix Nuxt 3.21+ bug)
  routeRules: {
    '/**': { ssr: false },
  },

  app: {
    head: {
      title: 'Sekuritas CMS - Admin Panel',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sekuritas Demo - CMS Admin Panel for Mutual Fund Platform' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/cms'
    }
  },

  imports: {
    dirs: ['stores']
  }
})
