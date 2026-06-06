<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Monitoring Transaksi</h2>
        <p class="text-sm text-gray-500 mt-0.5">Pantau seluruh aktivitas transaksi investasi</p>
      </div>
      <div class="text-sm text-gray-500">
        Total: <span class="font-bold text-gray-800">{{ pagination.total }}</span> transaksi
      </div>
    </div>

    <!-- Filter bar -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div class="flex flex-col sm:flex-row flex-wrap gap-3">
        <div class="flex-1 min-w-48 relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama investor atau produk..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            @input="debouncedSearch"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          @change="fetchTransactions"
        >
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          v-model="typeFilter"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          @change="fetchTransactions"
        >
          <option value="">Semua Tipe</option>
          <option value="subscription">Pembelian</option>
          <option value="redemption">Penjualan</option>
          <option value="switching">Switching</option>
        </select>
        <div class="flex items-center space-x-2">
          <input
            v-model="dateFrom"
            type="date"
            class="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            @change="fetchTransactions"
          />
          <span class="text-gray-400 text-sm">s/d</span>
          <input
            v-model="dateTo"
            type="date"
            class="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            @change="fetchTransactions"
          />
        </div>
        <button
          v-if="statusFilter || typeFilter || dateFrom || dateTo || searchQuery"
          @click="clearFilters"
          class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset Filter
        </button>
      </div>
    </div>

    <!-- Summary chips -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-white rounded-lg border border-gray-100 p-3 text-center shadow-sm">
        <p class="text-xl font-bold text-yellow-600">{{ summary.pending }}</p>
        <p class="text-xs text-gray-500 mt-0.5">Pending</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-100 p-3 text-center shadow-sm">
        <p class="text-xl font-bold text-green-600">{{ summary.completed }}</p>
        <p class="text-xs text-gray-500 mt-0.5">Completed</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-100 p-3 text-center shadow-sm">
        <p class="text-xl font-bold text-red-500">{{ summary.failed }}</p>
        <p class="text-xs text-gray-500 mt-0.5">Failed</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-100 p-3 text-center shadow-sm">
        <p class="text-base font-bold text-teal-700">{{ formatAmount(summary.totalVolume) }}</p>
        <p class="text-xs text-gray-500 mt-0.5">Total Volume</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-8">
        <div class="space-y-3">
          <div v-for="n in 6" :key="n" class="animate-pulse flex items-center space-x-4">
            <div class="h-4 bg-gray-200 rounded w-32"></div>
            <div class="h-4 bg-gray-200 rounded flex-1"></div>
            <div class="h-4 bg-gray-200 rounded w-24"></div>
            <div class="h-4 bg-gray-200 rounded w-20"></div>
            <div class="h-5 bg-gray-200 rounded-full w-20"></div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
        <table class="w-full min-w-[920px] text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Ref#</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Investor</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Produk</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Tipe</th>
              <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Nominal</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Status</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Tanggal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3.5 font-mono text-xs text-gray-500 whitespace-nowrap">{{ tx.ref_number || '#' + String(tx.id).padStart(6, '0') }}</td>
              <td class="px-5 py-3.5">
                <div class="flex items-center space-x-2">
                  <div
                    class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    :style="{ backgroundColor: getAvatarColor(tx.user_name) }"
                  >{{ tx.user_name?.charAt(0).toUpperCase() }}</div>
                  <span class="font-medium text-gray-900 text-sm">{{ tx.user_name }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <p class="text-sm text-gray-800 font-medium truncate max-w-40">{{ tx.product_name }}</p>
                <p class="text-xs text-gray-400">{{ tx.fund_code }}</p>
              </td>
              <td class="px-5 py-3.5">
                <span
                  class="inline-flex items-center space-x-1.5 px-2 py-1 rounded-full text-xs font-medium"
                  :class="txTypeClass(tx.type)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="txTypeDotClass(tx.type)"></span>
                  <span>{{ txTypeLabel(tx.type) }}</span>
                </span>
              </td>
              <td class="px-5 py-3.5 text-right font-semibold whitespace-nowrap" :class="tx.type === 'subscription' ? 'text-green-700' : tx.type === 'redemption' ? 'text-orange-600' : 'text-blue-600'">
                {{ tx.type === 'redemption' ? '-' : '' }}{{ formatAmount(tx.amount) }}
              </td>
              <td class="px-5 py-3.5">
                <StatusBadge :status="tx.status" />
              </td>
              <td class="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">{{ formatDate(tx.created_at) }}</td>
            </tr>
          </tbody>
        </table>
        </div>

        <div v-if="transactions.length === 0" class="py-16 text-center text-gray-400">
          <svg class="w-14 h-14 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <p class="font-medium">Tidak ada transaksi ditemukan</p>
          <p class="text-sm mt-1">Coba ubah filter pencarian Anda</p>
        </div>

        <!-- Pagination -->
        <div v-if="transactions.length > 0" class="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
          <p class="text-xs text-gray-500">
            Menampilkan {{ (pagination.page - 1) * pagination.perPage + 1 }}–{{ Math.min(pagination.page * pagination.perPage, pagination.total) }} dari {{ pagination.total }}
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
const route = useRoute()

const loading = ref(true)
const transactions = ref<any[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const pagination = ref({ page: 1, perPage: 15, total: 0, totalPages: 1 })
const summary = ref({ pending: 0, completed: 0, failed: 0, totalVolume: 0 })

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

const TX_TYPE_LABELS: Record<string, string> = {
  subscription: 'Pembelian',
  redemption: 'Penjualan',
  switching: 'Switching',
}
function txTypeLabel(type: string) {
  return TX_TYPE_LABELS[type] || type
}

const TX_TYPE_CLASSES: Record<string, string> = {
  subscription: 'bg-green-100 text-green-800',
  redemption: 'bg-orange-100 text-orange-800',
  switching: 'bg-blue-100 text-blue-800',
}
function txTypeClass(type: string) {
  return TX_TYPE_CLASSES[type] || 'bg-gray-100 text-gray-800'
}

const TX_TYPE_DOT_CLASSES: Record<string, string> = {
  subscription: 'bg-green-500',
  redemption: 'bg-orange-500',
  switching: 'bg-blue-500',
}
function txTypeDotClass(type: string) {
  return TX_TYPE_DOT_CLASSES[type] || 'bg-gray-400'
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatAmount(value: number) {
  if (!value) return 'Rp 0'
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(2)}M`
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(2)}Jt`
  return `Rp ${value.toLocaleString('id-ID')}`
}

function clearFilters() {
  statusFilter.value = ''
  typeFilter.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  searchQuery.value = ''
  pagination.value.page = 1
  fetchTransactions()
}

let searchTimeout: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    fetchTransactions()
  }, 400)
}

function changePage(page: number) {
  pagination.value.page = page
  fetchTransactions()
}

async function fetchTransactions() {
  loading.value = true
  const headers = { Authorization: `Bearer ${authStore.token}` }
  const params = new URLSearchParams({
    page: String(pagination.value.page),
    per_page: String(pagination.value.perPage),
    ...(statusFilter.value && { status: statusFilter.value }),
    ...(typeFilter.value && { type: typeFilter.value }),
    ...(dateFrom.value && { date_from: dateFrom.value }),
    ...(dateTo.value && { date_to: dateTo.value }),
    ...(searchQuery.value && { search: searchQuery.value }),
    ...(route.query.user && { user_id: String(route.query.user) })
  })

  try {
    const data = await $fetch<any>(`${config.public.apiBase}/transactions?${params}`, { headers })
    transactions.value = data.data ?? data
    if (data.meta || data.total) {
      pagination.value.total = data.meta?.total ?? data.total ?? 0
      pagination.value.totalPages = data.meta?.last_page ?? data.last_page ?? 1
    }
    if (data.summary) {
      summary.value = data.summary
    }
  } catch {
    transactions.value = [
      { id: 1, ref_number: 'TXN-20250115-001', user_name: 'Budi Santoso', product_name: 'Manulife Dana Saham', fund_code: 'MLDNS', type: 'subscription', amount: 5_000_000, status: 'completed', created_at: '2025-01-15T10:30:00Z' },
      { id: 2, ref_number: 'TXN-20250115-002', user_name: 'Siti Rahayu', product_name: 'Schroder 90 Plus', fund_code: 'SPTR9', type: 'redemption', amount: 2_500_000, status: 'pending', created_at: '2025-01-15T11:00:00Z' },
      { id: 3, ref_number: 'TXN-20250114-003', user_name: 'Ahmad Fauzi', product_name: 'Mandiri Pasar Uang', fund_code: 'MPUMU', type: 'subscription', amount: 10_000_000, status: 'completed', created_at: '2025-01-14T09:15:00Z' },
      { id: 4, ref_number: 'TXN-20250114-004', user_name: 'Dewi Lestari', product_name: 'Bahana MES Pendapatan Tetap Syariah', fund_code: 'BPTSY', type: 'subscription', amount: 3_000_000, status: 'completed', created_at: '2025-01-14T14:30:00Z' },
      { id: 5, ref_number: 'TXN-20250113-005', user_name: 'Rudi Hermawan', product_name: 'Manulife Dana Saham', fund_code: 'MLDNS', type: 'switching', amount: 7_500_000, status: 'failed', created_at: '2025-01-13T16:00:00Z' },
      { id: 6, ref_number: 'TXN-20250113-006', user_name: 'Rina Andriani', product_name: 'Mandiri Pasar Uang', fund_code: 'MPUMU', type: 'redemption', amount: 1_500_000, status: 'completed', created_at: '2025-01-13T10:00:00Z' }
    ]
    pagination.value.total = 6
    pagination.value.totalPages = 1
    summary.value = { pending: 1, completed: 4, failed: 1, totalVolume: 29_500_000 }
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchTransactions())
</script>
