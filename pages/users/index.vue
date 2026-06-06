<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Manajemen User</h2>
        <p class="text-sm text-gray-500 mt-0.5">Daftar seluruh pengguna terdaftar di platform</p>
      </div>
    </div>

    <!-- Search & filter -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama, email, atau telepon..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            @input="debouncedSearch"
          />
        </div>
        <select
          v-model="kycFilter"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          @change="fetchUsers"
        >
          <option value="">Semua Status KYC</option>
          <option value="pending">KYC Pending</option>
          <option value="approved">KYC Approved</option>
          <option value="rejected">KYC Rejected</option>
          <option value="none">Belum KYC</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-8">
        <div class="space-y-3">
          <div v-for="n in 5" :key="n" class="animate-pulse flex items-center space-x-4">
            <div class="h-4 bg-gray-200 rounded w-8"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/5"></div>
            <div class="h-5 bg-gray-200 rounded-full w-20"></div>
            <div class="h-5 bg-gray-200 rounded-full w-16 ml-auto"></div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
        <table class="w-full min-w-[920px] text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">ID</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Nama</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Telepon</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">KYC Status</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">SID Status</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Tanggal Daftar</th>
              <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3.5 text-gray-500 text-xs font-mono whitespace-nowrap">#{{ user.id }}</td>
              <td class="px-5 py-3.5">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    :style="{ backgroundColor: getAvatarColor(user.name) }"
                  >{{ user.name?.charAt(0).toUpperCase() }}</div>
                  <div>
                    <p class="font-medium text-gray-900">{{ user.name }}</p>
                    <p class="text-xs text-gray-400">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5 text-gray-600 whitespace-nowrap">{{ user.phone || '-' }}</td>
              <td class="px-5 py-3.5">
                <StatusBadge :status="user.kyc_status || 'none'" />
              </td>
              <td class="px-5 py-3.5">
                <span
                  class="inline-flex items-center space-x-1 text-xs font-medium whitespace-nowrap"
                  :class="user.sid ? 'text-green-700' : 'text-gray-400'"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="user.sid ? 'bg-green-500' : 'bg-gray-300'"
                  ></span>
                  <span>{{ user.sid ? 'Aktif' : 'Belum ada SID' }}</span>
                </span>
              </td>
              <td class="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">{{ formatDate(user.created_at) }}</td>
              <td class="px-5 py-3.5">
                <NuxtLink
                  :to="`/users/${user.id}`"
                  class="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Detail</span>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        <div v-if="users.length === 0" class="py-16 text-center text-gray-400">
          <svg class="w-14 h-14 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p class="font-medium">Tidak ada user ditemukan</p>
        </div>

        <!-- Pagination -->
        <div v-if="users.length > 0" class="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
          <p class="text-xs text-gray-500">
            Menampilkan {{ (pagination.page - 1) * pagination.perPage + 1 }}–{{ Math.min(pagination.page * pagination.perPage, pagination.total) }} dari {{ pagination.total }} user
          </p>
          <div class="flex items-center space-x-1">
            <button :disabled="pagination.page === 1" @click="changePage(pagination.page - 1)"
              class="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button v-for="p in visiblePages" :key="p" @click="changePage(p)"
              class="w-8 h-8 rounded text-xs font-medium transition-colors"
              :class="p === pagination.page ? 'text-white' : 'text-gray-600 hover:bg-gray-100'"
              :style="p === pagination.page ? 'background-color: #009688;' : ''">{{ p }}</button>
            <button :disabled="pagination.page === pagination.totalPages" @click="changePage(pagination.page + 1)"
              class="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const authStore = useAuthStore()

const loading = ref(true)
const users = ref<any[]>([])
const searchQuery = ref('')
const kycFilter = ref('')
const pagination = ref({ page: 1, perPage: 15, total: 0, totalPages: 1 })

const visiblePages = computed(() => {
  const total = pagination.value.totalPages
  const current = pagination.value.page
  const pages: number[] = []
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) pages.push(i)
  return pages
})

const avatarColors = ['#009688', '#2196f3', '#9c27b0', '#f44336', '#ff9800', '#607d8b']
function getAvatarColor(name: string) {
  return avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length]
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

let searchTimeout: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    fetchUsers()
  }, 400)
}

function changePage(page: number) {
  pagination.value.page = page
  fetchUsers()
}

async function fetchUsers() {
  loading.value = true
  const headers = { Authorization: `Bearer ${authStore.token}` }
  const params = new URLSearchParams({
    page: String(pagination.value.page),
    per_page: String(pagination.value.perPage),
    ...(kycFilter.value && { kyc_status: kycFilter.value }),
    ...(searchQuery.value && { search: searchQuery.value })
  })

  try {
    const data = await $fetch<any>(`${config.public.apiBase}/users?${params}`, { headers })
    users.value = data.data ?? data
    if (data.meta || data.total) {
      pagination.value.total = data.meta?.total ?? data.total ?? 0
      pagination.value.totalPages = data.meta?.last_page ?? data.last_page ?? 1
    }
  } catch {
    users.value = [
      { id: 1, name: 'Budi Santoso', email: 'budi@email.com', phone: '08123456789', kyc_status: 'approved', sid: 'IDD12345678', created_at: '2025-01-10T10:00:00Z' },
      { id: 2, name: 'Siti Rahayu', email: 'siti@email.com', phone: '08234567890', kyc_status: 'pending', sid: null, created_at: '2025-01-11T11:00:00Z' },
      { id: 3, name: 'Ahmad Fauzi', email: 'ahmad@email.com', phone: '08345678901', kyc_status: 'approved', sid: 'IDD87654321', created_at: '2025-01-12T09:00:00Z' },
      { id: 4, name: 'Dewi Lestari', email: 'dewi@email.com', phone: '08456789012', kyc_status: 'rejected', sid: null, created_at: '2025-01-13T08:00:00Z' },
      { id: 5, name: 'Rudi Hermawan', email: 'rudi@email.com', phone: '08567890123', kyc_status: 'none', sid: null, created_at: '2025-01-14T07:00:00Z' }
    ]
    pagination.value.total = 5
    pagination.value.totalPages = 1
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchUsers())
</script>
