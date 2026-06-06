export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (process.client) {
    authStore.initFromStorage()
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  const allowedRoles = ['admin_ops', 'super_admin']
  if (!authStore.user || !allowedRoles.includes(authStore.user.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Insufficient permissions'
    })
  }
})
