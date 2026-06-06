<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Produk Reksa Dana</h2>
        <p class="text-sm text-gray-500 mt-0.5">Kelola produk investasi yang tersedia di platform</p>
      </div>
      <NuxtLink
        to="/products/create"
        class="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
        style="background-color: #009688;"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Tambah Produk</span>
      </NuxtLink>
    </div>

    <!-- Filter bar -->
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
            placeholder="Cari kode atau nama produk..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            @input="debouncedSearch"
          />
        </div>
        <select
          v-model="typeFilter"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          @change="fetchProducts"
        >
          <option value="">Semua Jenis</option>
          <option value="saham">Saham</option>
          <option value="pendapatan_tetap">Pendapatan Tetap</option>
          <option value="campuran">Campuran</option>
          <option value="pasar_uang">Pasar Uang</option>
          <option value="index">Indeks</option>
        </select>
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          @change="fetchProducts"
        >
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-8">
        <div class="space-y-3">
          <div v-for="n in 5" :key="n" class="animate-pulse flex items-center space-x-4">
            <div class="h-4 bg-gray-200 rounded w-20"></div>
            <div class="h-4 bg-gray-200 rounded flex-1"></div>
            <div class="h-4 bg-gray-200 rounded w-24"></div>
            <div class="h-4 bg-gray-200 rounded w-24"></div>
            <div class="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
        <table class="w-full min-w-[1040px] text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th
                v-for="col in columns"
                :key="col.key"
                class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
                :class="col.sortable ? 'hover:text-gray-700' : ''"
                @click="col.sortable && sort(col.key)"
              >
                <div class="flex items-center space-x-1">
                  <span>{{ col.label }}</span>
                  <span v-if="col.sortable" class="flex flex-col">
                    <svg class="w-3 h-3" :class="sortKey === col.key && sortDir === 'asc' ? 'text-teal-600' : 'text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                    <svg class="w-3 h-3 -mt-1" :class="sortKey === col.key && sortDir === 'desc' ? 'text-teal-600' : 'text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </th>
              <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="product in sortedProducts" :key="product.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3.5 font-mono text-xs font-semibold text-teal-700 bg-teal-50/30 whitespace-nowrap">
                {{ product.fund_code }}
              </td>
              <td class="px-5 py-3.5">
                <div>
                  <p class="font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-xs text-gray-400">{{ product.investment_manager }}</p>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <span class="inline-block px-2 py-0.5 text-xs font-medium rounded-full" :class="fundTypeClass(product.fund_type)">
                  {{ fundTypeLabel(product.fund_type) }}
                </span>
                <span v-if="product.is_syariah" class="ml-1 inline-block px-1.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  Syariah
                </span>
              </td>
              <td class="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                {{ formatNAV(product.nav_per_unit) }}
              </td>
              <td class="px-5 py-3.5 font-medium whitespace-nowrap" :class="(product.performance_1yr || 0) >= 0 ? 'text-green-600' : 'text-red-500'">
                {{ product.performance_1yr !== undefined ? (product.performance_1yr >= 0 ? '+' : '') + product.performance_1yr?.toFixed(2) + '%' : '-' }}
              </td>
              <td class="px-5 py-3.5 text-gray-600 text-xs whitespace-nowrap">{{ formatAUM(product.aum) }}</td>
              <td class="px-5 py-3.5 whitespace-nowrap">
                <span
                  class="inline-flex items-center space-x-1 text-xs font-medium"
                  :class="product.is_active ? 'text-green-700' : 'text-gray-400'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="product.is_active ? 'bg-green-500' : 'bg-gray-300'"></span>
                  <span>{{ product.is_active ? 'Aktif' : 'Nonaktif' }}</span>
                </span>
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center justify-end space-x-2">
                  <NuxtLink
                    :to="`/products/${product.id}/edit`"
                    class="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </NuxtLink>
                  <button
                    @click="toggleActive(product)"
                    class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                    :class="product.is_active
                      ? 'text-orange-700 bg-orange-50 hover:bg-orange-100'
                      : 'text-green-700 bg-green-50 hover:bg-green-100'"
                  >
                    {{ product.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        <div v-if="products.length === 0" class="py-16 text-center text-gray-400">
          <svg class="w-14 h-14 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p class="font-medium">Belum ada produk</p>
        </div>

        <!-- Pagination -->
        <div v-if="products.length > 0" class="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
          <p class="text-xs text-gray-500">{{ products.length }} produk ditampilkan dari {{ pagination.total }} total</p>
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
const products = ref<any[]>([])
const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const sortKey = ref('name')
const sortDir = ref<'asc' | 'desc'>('asc')
const pagination = ref({ page: 1, perPage: 15, total: 0, totalPages: 1 })

const columns = [
  { key: 'fund_code', label: 'Kode', sortable: true },
  { key: 'name', label: 'Nama Produk', sortable: true },
  { key: 'fund_type', label: 'Jenis', sortable: true },
  { key: 'nav_per_unit', label: 'NAV/Unit', sortable: true },
  { key: 'performance_1yr', label: 'Return 1 Thn', sortable: true },
  { key: 'aum', label: 'AUM', sortable: true },
  { key: 'is_active', label: 'Status', sortable: false }
]

const sortedProducts = computed(() => {
  return [...products.value].sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]
    if (aVal === bVal) return 0
    const result = aVal > bVal ? 1 : -1
    return sortDir.value === 'asc' ? result : -result
  })
})

const visiblePages = computed(() => {
  const total = pagination.value.totalPages
  const current = pagination.value.page
  const pages: number[] = []
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) pages.push(i)
  return pages
})

function sort(key: string) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

function fundTypeLabel(type: string) {
  const map: Record<string, string> = {
    saham: 'Saham', pendapatan_tetap: 'Pendapatan Tetap', campuran: 'Campuran', pasar_uang: 'Pasar Uang', index: 'Indeks'
  }
  return map[type] || type
}

function fundTypeClass(type: string) {
  const map: Record<string, string> = {
    saham: 'bg-red-100 text-red-700', pendapatan_tetap: 'bg-blue-100 text-blue-700',
    campuran: 'bg-purple-100 text-purple-700', pasar_uang: 'bg-green-100 text-green-700', index: 'bg-orange-100 text-orange-700'
  }
  return map[type] || 'bg-gray-100 text-gray-700'
}

function formatNAV(value: number) {
  if (!value) return '-'
  return `Rp ${value.toLocaleString('id-ID')}`
}

function formatAUM(value: number) {
  if (!value) return '-'
  if (value >= 1_000_000_000_000) return `Rp ${(value / 1_000_000_000_000).toFixed(1)}T`
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`
  return `Rp ${(value / 1_000_000).toFixed(0)}Jt`
}

let searchTimeout: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    fetchProducts()
  }, 400)
}

function changePage(page: number) {
  pagination.value.page = page
  fetchProducts()
}

async function toggleActive(product: any) {
  const action = product.is_active ? 'nonaktifkan' : 'aktifkan'
  if (!confirm(`Yakin ingin ${action} produk "${product.name}"?`)) return
  try {
    await $fetch(`${config.public.apiBase}/products/${product.id}/toggle`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    product.is_active = !product.is_active
  } catch {
    product.is_active = !product.is_active
  }
}

async function fetchProducts() {
  loading.value = true
  const headers = { Authorization: `Bearer ${authStore.token}` }
  const params = new URLSearchParams({
    page: String(pagination.value.page),
    per_page: String(pagination.value.perPage),
    ...(typeFilter.value && { fund_type: typeFilter.value }),
    ...(statusFilter.value && { is_active: statusFilter.value === 'active' ? '1' : '0' }),
    ...(searchQuery.value && { search: searchQuery.value })
  })

  try {
    const data = await $fetch<any>(`${config.public.apiBase}/products?${params}`, { headers })
    products.value = data.data ?? data
    if (data.meta || data.total) {
      pagination.value.total = data.meta?.total ?? data.total ?? 0
      pagination.value.totalPages = data.meta?.last_page ?? data.last_page ?? 1
    }
  } catch {
    products.value = [
      { id: 1, fund_code: 'MLDNS', name: 'Manulife Dana Saham', investment_manager: 'Manulife Aset Manajemen', fund_type: 'saham', nav_per_unit: 8750, performance_1yr: 12.5, aum: 5_200_000_000_000, is_active: true, is_syariah: false },
      { id: 2, fund_code: 'SPTR9', name: 'Schroder 90 Plus Equity', investment_manager: 'Schroder Investment Management', fund_type: 'saham', nav_per_unit: 3215, performance_1yr: 8.2, aum: 2_800_000_000_000, is_active: true, is_syariah: false },
      { id: 3, fund_code: 'MPUMU', name: 'Mandiri Pasar Uang', investment_manager: 'Mandiri Investasi', fund_type: 'pasar_uang', nav_per_unit: 1025, performance_1yr: 4.8, aum: 8_500_000_000_000, is_active: true, is_syariah: false },
      { id: 4, fund_code: 'BPTSY', name: 'Bahana MES Pendapatan Tetap Syariah', investment_manager: 'Bahana TCW', fund_type: 'pendapatan_tetap', nav_per_unit: 2148, performance_1yr: 6.1, aum: 1_200_000_000_000, is_active: true, is_syariah: true },
      { id: 5, fund_code: 'PRIND', name: 'Prospera Indonesia Balanced', investment_manager: 'Prospera Asset Mgmt', fund_type: 'campuran', nav_per_unit: 1890, performance_1yr: -2.3, aum: 950_000_000_000, is_active: false, is_syariah: false }
    ]
    pagination.value.total = 5
    pagination.value.totalPages = 1
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchProducts())
</script>
