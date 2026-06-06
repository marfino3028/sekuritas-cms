<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">KYC Management</h2>
        <p class="text-sm text-gray-500 mt-0.5">Kelola dan proses pengajuan verifikasi identitas investor</p>
      </div>
      <div class="flex items-center space-x-2 text-sm text-gray-500">
        <span class="font-medium">Total:</span>
        <span class="font-bold text-gray-800">{{ pagination.total }}</span>
      </div>
    </div>

    <!-- Filters & Search bar -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Search -->
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama atau NIK..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            @input="debouncedSearch"
          />
        </div>

        <!-- Status filter -->
        <div class="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            v-for="f in filters"
            :key="f.value"
            @click="setFilter(f.value)"
            class="px-4 py-2 text-sm font-medium transition-colors"
            :class="activeFilter === f.value
              ? 'bg-teal-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'"
          >
            {{ f.label }}
            <span
              v-if="f.count !== undefined"
              class="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
              :class="activeFilter === f.value ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-500'"
            >{{ f.count }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-8">
        <div class="space-y-3">
          <div v-for="n in 5" :key="n" class="animate-pulse flex items-center space-x-4">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/6"></div>
            <div class="h-5 bg-gray-200 rounded-full w-20"></div>
            <div class="h-8 bg-gray-200 rounded w-28 ml-auto"></div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
        <table class="w-full min-w-[840px] text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Nama Investor</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">NIK</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Tanggal Submit</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Status</th>
              <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="item in kycList"
              :key="item.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-5 py-3.5">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    :style="{ backgroundColor: getAvatarColor(item.name) }"
                  >{{ item.name.charAt(0).toUpperCase() }}</div>
                  <div>
                    <p class="font-medium text-gray-900">{{ item.name }}</p>
                    <p class="text-xs text-gray-400">{{ item.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5 text-gray-600 font-mono text-sm whitespace-nowrap">{{ maskNIK(item.nik) }}</td>
              <td class="px-5 py-3.5 text-gray-500 whitespace-nowrap">{{ formatDate(item.submitted_at) }}</td>
              <td class="px-5 py-3.5 whitespace-nowrap">
                <StatusBadge :status="item.status" />
              </td>
              <td class="px-5 py-3.5 whitespace-nowrap">
                <div class="flex items-center justify-end space-x-2">
                  <NuxtLink
                    :to="`/kyc/${item.id}`"
                    class="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Lihat Detail</span>
                  </NuxtLink>

                  <button
                    v-if="item.status === 'pending'"
                    @click="quickApprove(item)"
                    class="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Approve</span>
                  </button>

                  <button
                    v-if="item.status === 'pending'"
                    @click="openRejectModal(item)"
                    class="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Reject</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        <!-- Empty state -->
        <div v-if="kycList.length === 0" class="py-16 text-center text-gray-400">
          <svg class="w-14 h-14 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          <p class="font-medium">Tidak ada data KYC</p>
          <p class="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
        </div>

        <!-- Pagination -->
        <div v-if="kycList.length > 0" class="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
          <p class="text-xs text-gray-500">
            Menampilkan {{ (pagination.page - 1) * pagination.perPage + 1 }}–{{ Math.min(pagination.page * pagination.perPage, pagination.total) }} dari {{ pagination.total }} data
          </p>
          <div class="flex items-center space-x-1">
            <button
              :disabled="pagination.page === 1"
              @click="changePage(pagination.page - 1)"
              class="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              v-for="p in visiblePages"
              :key="p"
              @click="changePage(p)"
              class="w-8 h-8 rounded text-xs font-medium transition-colors"
              :class="p === pagination.page ? 'text-white' : 'text-gray-600 hover:bg-gray-100'"
              :style="p === pagination.page ? 'background-color: #009688;' : ''"
            >{{ p }}</button>
            <button
              :disabled="pagination.page === pagination.totalPages"
              @click="changePage(pagination.page + 1)"
              class="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <ConfirmModal
      v-if="showRejectModal"
      title="Tolak KYC"
      :message="`Anda akan menolak KYC dari ${selectedKyc?.name}. Berikan alasan penolakan:`"
      confirm-label="Tolak KYC"
      confirm-variant="danger"
      :loading="actionLoading"
      @confirm="confirmReject"
      @cancel="showRejectModal = false"
    >
      <textarea
        v-model="rejectReason"
        rows="3"
        placeholder="Alasan penolakan (contoh: foto KTP tidak jelas, data tidak sesuai, dll.)"
        class="w-full mt-3 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
      ></textarea>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const authStore = useAuthStore()
const route = useRoute()

const loading = ref(true)
const actionLoading = ref(false)
const kycList = ref<any[]>([])
const searchQuery = ref('')
const activeFilter = ref((route.query.filter as string) || 'all')
const showRejectModal = ref(false)
const selectedKyc = ref<any>(null)
const rejectReason = ref('')

const filters = [
  { label: 'Semua', value: 'all', count: undefined as number | undefined },
  { label: 'Pending', value: 'pending', count: undefined as number | undefined },
  { label: 'Approved', value: 'approved', count: undefined as number | undefined },
  { label: 'Rejected', value: 'rejected', count: undefined as number | undefined }
]

const pagination = ref({ page: 1, perPage: 10, total: 0, totalPages: 1 })

const visiblePages = computed(() => {
  const total = pagination.value.totalPages
  const current = pagination.value.page
  const pages: number[] = []
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }
  return pages
})

const avatarColors = ['#009688', '#2196f3', '#9c27b0', '#f44336', '#ff9800', '#607d8b']
function getAvatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length]
}

function maskNIK(nik: string) {
  if (!nik) return '-'
  return nik.slice(0, 6) + '••••••' + nik.slice(-4)
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
    fetchKyc()
  }, 400)
}

function setFilter(value: string) {
  activeFilter.value = value
  pagination.value.page = 1
  fetchKyc()
}

function changePage(page: number) {
  pagination.value.page = page
  fetchKyc()
}

function openRejectModal(item: any) {
  selectedKyc.value = item
  rejectReason.value = ''
  showRejectModal.value = true
}

async function quickApprove(item: any) {
  if (!confirm(`Approve KYC dari ${item.name}?`)) return
  try {
    await $fetch(`${config.public.apiBase}/kyc/${item.id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    item.status = 'approved'
  } catch {
    alert('Gagal mengapprove KYC. Silakan coba lagi.')
  }
}

async function confirmReject() {
  if (!rejectReason.value.trim()) {
    alert('Mohon isi alasan penolakan.')
    return
  }
  actionLoading.value = true
  try {
    await $fetch(`${config.public.apiBase}/kyc/${selectedKyc.value.id}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { reason: rejectReason.value }
    })
    selectedKyc.value.status = 'rejected'
    showRejectModal.value = false
  } catch {
    alert('Gagal menolak KYC. Silakan coba lagi.')
  } finally {
    actionLoading.value = false
  }
}

async function fetchKyc() {
  loading.value = true
  const headers = { Authorization: `Bearer ${authStore.token}` }
  const params = new URLSearchParams({
    page: String(pagination.value.page),
    per_page: String(pagination.value.perPage),
    ...(activeFilter.value !== 'all' && { status: activeFilter.value }),
    ...(searchQuery.value && { search: searchQuery.value })
  })

  try {
    const data = await $fetch<any>(`${config.public.apiBase}/kyc?${params}`, { headers })
    kycList.value = data.data ?? data
    if (data.meta || data.total) {
      pagination.value.total = data.meta?.total ?? data.total ?? 0
      pagination.value.totalPages = data.meta?.last_page ?? data.last_page ?? 1
    }
  } catch {
    kycList.value = [
      { id: 1, name: 'Budi Santoso', email: 'budi@email.com', nik: '3171012345678901', status: 'pending', submitted_at: '2025-01-15T10:30:00Z' },
      { id: 2, name: 'Siti Rahayu', email: 'siti@email.com', nik: '3275019876543210', status: 'approved', submitted_at: '2025-01-14T14:20:00Z' },
      { id: 3, name: 'Ahmad Fauzi', email: 'ahmad@email.com', nik: '3374021234567890', status: 'pending', submitted_at: '2025-01-14T09:15:00Z' },
      { id: 4, name: 'Dewi Lestari', email: 'dewi@email.com', nik: '3473039876543211', status: 'rejected', submitted_at: '2025-01-13T16:45:00Z' },
      { id: 5, name: 'Rudi Hermawan', email: 'rudi@email.com', nik: '3572051234567891', status: 'pending', submitted_at: '2025-01-13T11:00:00Z' }
    ]
    pagination.value.total = 5
    pagination.value.totalPages = 1
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchKyc())
</script>
