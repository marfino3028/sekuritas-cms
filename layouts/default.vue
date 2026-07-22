<template>
  <div class="flex h-screen bg-slate-50 font-sans overflow-hidden">
    <!-- Sidebar -->
    <aside
      :class="[
        'flex flex-col transition-all duration-300 ease-in-out flex-shrink-0',
        sidebarOpen ? 'w-64' : 'w-16'
      ]"
      style="background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%)"
    >
      <!-- Logo -->
      <div class="flex items-center h-16 px-4 flex-shrink-0" style="border-bottom: 1px solid rgba(255,255,255,0.07)">
        <div class="flex items-center overflow-hidden" :class="sidebarOpen ? 'space-x-3' : 'justify-center w-full'">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
               style="background: linear-gradient(135deg, #A40001, #7D0001)">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <transition name="fade">
            <div v-if="sidebarOpen">
              <p class="text-white font-bold text-sm leading-none">Victoria Sekuritas</p>
              <p class="text-xs leading-none mt-0.5" style="color: #D59997">Admin Panel</p>
            </div>
          </transition>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <div class="px-2 space-y-0.5">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center rounded-xl transition-all duration-150 group relative"
            :class="[
              sidebarOpen ? 'px-3 py-2.5 space-x-3' : 'px-2 py-2.5 justify-center',
              isActive(item.path)
                ? 'text-teal-300'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            ]"
            :style="isActive(item.path)
              ? 'background: rgba(164,0,1,0.12); border-left: 2px solid #A40001;'
              : 'border-left: 2px solid transparent;'"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
            <transition name="fade">
              <span v-if="sidebarOpen" class="text-sm font-medium truncate">{{ item.label }}</span>
            </transition>
            <!-- Tooltip when collapsed -->
            <div
              v-if="!sidebarOpen"
              class="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg"
              style="background: #0f172a; border: 1px solid rgba(255,255,255,0.1)"
            >
              {{ item.label }}
            </div>
          </NuxtLink>
        </div>
      </nav>

      <!-- User profile at bottom -->
      <div class="p-3 flex-shrink-0" style="border-top: 1px solid rgba(255,255,255,0.07)">
        <div class="flex items-center" :class="sidebarOpen ? 'space-x-3' : 'justify-center'">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style="background: linear-gradient(135deg, #A40001, #7D0001)"
          >
            {{ authStore.userInitials }}
          </div>
          <transition name="fade">
            <div v-if="sidebarOpen" class="overflow-hidden">
              <p class="text-white text-xs font-semibold truncate">{{ authStore.user?.name }}</p>
              <p class="text-xs truncate capitalize" style="color: #64748b">{{ authStore.user?.role?.replace('_', ' ') }}</p>
            </div>
          </transition>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Topbar -->
      <header class="h-16 bg-white flex items-center px-4 flex-shrink-0 shadow-sm" style="border-bottom: 1px solid #f1f5f9">
        <!-- Toggle sidebar -->
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors mr-4"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Page title -->
        <div class="flex-1">
          <h1 class="text-sm font-semibold text-gray-800">{{ pageTitle }}</h1>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-2">
          <!-- Notification bell -->
          <button class="relative p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <!-- Admin info + logout -->
          <div class="flex items-center space-x-3 pl-3" style="border-left: 1px solid #f1f5f9">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-semibold text-gray-800">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-400 capitalize">{{ authStore.user?.role?.replace('_', ' ') }}</p>
            </div>
            <button
              @click="handleLogout"
              class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()
const sidebarOpen = ref(true)

const menuItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
    }
  },
  {
    path: '/kyc',
    label: 'KYC Management',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/></svg>`
    }
  },
  {
    path: '/users',
    label: 'Users',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
    }
  },
  {
    path: '/products',
    label: 'Products',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>`
    }
  },
  {
    path: '/articles',
    label: 'Artikel',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>`
    }
  },
  {
    path: '/events',
    label: 'Event & Promo',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 010 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 010-4V7a2 2 0 00-2-2H5z"/></svg>`
    }
  },
  {
    path: '/transactions',
    label: 'Transactions',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`
    }
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
    }
  }
]

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/kyc': 'KYC Management',
  '/users': 'Manajemen User',
  '/products': 'Produk Reksa Dana',
  '/products/create': 'Tambah Produk',
  '/articles': 'Artikel & Berita',
  '/articles/create': 'Tambah Artikel',
  '/events': 'Event & Promo',
  '/transactions': 'Monitoring Transaksi',
  '/reports': 'Laporan'
}

const pageTitle = computed(() => {
  const path = route.path
  if (pageTitles[path]) return pageTitles[path]
  if (path.startsWith('/kyc/')) return 'Detail KYC'
  if (path.startsWith('/users/')) return 'Detail User'
  if (path.startsWith('/articles/') && path.includes('/edit')) return 'Edit Artikel'
  if (path.includes('/edit')) return 'Edit Produk'
  return 'Admin Panel'
})

function isActive(path: string): boolean {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}

async function handleLogout() {
  await authStore.logout()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
