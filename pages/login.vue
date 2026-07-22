<template>
  <div class="min-h-screen relative overflow-hidden flex items-center justify-center px-4"
       style="background: linear-gradient(160deg, #0f172a 0%, #0B2A5B 45%, #0c1a30 100%)">
    <!-- Decorative orbs -->
    <div class="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
         style="background: radial-gradient(circle, rgba(30,86,201,0.22) 0%, transparent 65%)"></div>
    <div class="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
         style="background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 65%)"></div>

    <div class="relative z-10 w-full max-w-md">
      <!-- Logo section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
             style="background: linear-gradient(135deg, #1E56C9, #0B2A5B)">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Victoria Sekuritas — CMS</h1>
        <p class="text-sm mt-1" style="color: #FFCB3D">Admin Panel — Back Office</p>
      </div>

      <!-- Login card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-800">Selamat datang</h2>
          <p class="text-gray-400 text-sm mt-1">Masuk dengan akun administrator Anda</p>
        </div>

        <!-- Error alert -->
        <div v-if="authStore.error" class="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
          <div class="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01" />
            </svg>
          </div>
          <p class="text-red-600 text-sm leading-relaxed">{{ authStore.error }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                placeholder="admin@sekuritas.co.id"
                class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white transition-all"
                :class="{ 'border-red-300 bg-red-50 focus:ring-red-200': authStore.error }"
                style="--tw-ring-color: rgba(30,86,201,0.25)"
                @focus="authStore.error = null"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white transition-all"
                :class="{ 'border-red-300 bg-red-50 focus:ring-red-200': authStore.error }"
                @focus="authStore.error = null"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-3 px-4 text-white font-semibold rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
            style="background: linear-gradient(135deg, #1E56C9, #0B2A5B)"
          >
            <span v-if="!authStore.loading" class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Masuk ke Panel Admin
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Memverifikasi...
            </span>
          </button>
        </form>

        <div class="mt-6 flex items-center gap-2">
          <div class="flex-1 h-px bg-gray-100"></div>
          <p class="text-xs text-gray-400 px-2">Akses terbatas — admin only</p>
          <div class="flex-1 h-px bg-gray-100"></div>
        </div>
      </div>

      <p class="text-center text-xs mt-6" style="color: #475569">
        &copy; {{ new Date().getFullYear() }} Victoria Sekuritas — CMS v1.0
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'auth'
})

const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})
const showPassword = ref(false)

async function handleLogin() {
  await authStore.login(form.email, form.password)
}
</script>
