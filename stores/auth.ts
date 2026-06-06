import { defineStore } from 'pinia'

interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
}

interface AuthState {
  user: AdminUser | null
  token: string | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'super_admin' || state.user?.role === 'admin_ops',
    isSuperAdmin: (state) => state.user?.role === 'super_admin',
    userInitials: (state) => {
      if (!state.user?.name) return 'A'
      return state.user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
  },

  actions: {
    async login(email: string, password: string) {
      const config = useRuntimeConfig()
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<{ success: boolean; data: { token: string; user: AdminUser } }>(
          `${config.public.apiBase}/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          }
        )

        this.token = response.data.token
        this.user = response.data.user

        // Persist to localStorage
        if (process.client) {
          localStorage.setItem('cms_token', response.data.token)
          localStorage.setItem('cms_user', JSON.stringify(response.data.user))
        }

        await navigateTo('/dashboard')
      } catch (err: any) {
        this.error = err?.data?.message || err?.message || 'Login gagal. Periksa email dan password Anda.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const config = useRuntimeConfig()

      try {
        if (this.token) {
          await $fetch(`${config.public.apiBase}/auth/logout`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${this.token}` }
          })
        }
      } catch {
        // Ignore logout errors
      } finally {
        this.token = null
        this.user = null

        if (process.client) {
          localStorage.removeItem('cms_token')
          localStorage.removeItem('cms_user')
        }

        await navigateTo('/login')
      }
    },

    async fetchMe() {
      const config = useRuntimeConfig()
      if (!this.token) return

      try {
        const response = await $fetch<{ success: boolean; data: AdminUser }>(`${config.public.apiBase}/auth/me`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.user = response.data
      } catch {
        this.clearAuth()
      }
    },

    initFromStorage() {
      if (!process.client) return
      const token = localStorage.getItem('cms_token')
      const userStr = localStorage.getItem('cms_user')

      if (token && userStr) {
        try {
          this.token = token
          this.user = JSON.parse(userStr)
        } catch {
          this.clearAuth()
        }
      }
    },

    clearAuth() {
      this.token = null
      this.user = null
      if (process.client) {
        localStorage.removeItem('cms_token')
        localStorage.removeItem('cms_user')
      }
    }
  }
})
