export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Initialize from localStorage on client
  if (process.client) {
    authStore.initFromStorage()
  }

  // Allow access to login page always
  if (to.path === '/login') {
    if (authStore.isAuthenticated) {
      return navigateTo('/dashboard')
    }
    return
  }

  // Protect all other routes
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
