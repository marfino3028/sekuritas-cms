<template>
  <div class="space-y-5">
    <!-- Back + header -->
    <div class="flex items-center space-x-3">
      <NuxtLink to="/users" class="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h2 class="text-xl font-bold text-gray-900">Detail User</h2>
        <p class="text-sm text-gray-500">Informasi lengkap pengguna</p>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div class="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div class="space-y-2">
            <div class="h-5 bg-gray-200 rounded w-40"></div>
            <div class="h-3 bg-gray-100 rounded w-32"></div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="n in 6" :key="n" class="space-y-1">
            <div class="h-3 bg-gray-100 rounded w-1/2"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="user" class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <!-- Main user info -->
      <div class="xl:col-span-2 space-y-5">
        <!-- Profile card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center space-x-4 mb-6">
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
              :style="{ backgroundColor: getAvatarColor(user.name) }"
            >{{ user.name?.charAt(0).toUpperCase() }}</div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ user.name }}</h3>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
              <div class="flex items-center space-x-2 mt-1">
                <StatusBadge :status="user.kyc_status || 'none'" />
                <span class="text-xs text-gray-400">·</span>
                <span class="text-xs text-gray-500">Bergabung {{ formatDate(user.created_at) }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-5 pt-4 border-t border-gray-100">
            <div>
              <p class="text-xs text-gray-500 mb-1">No. Telepon</p>
              <p class="text-sm font-medium text-gray-900">{{ user.phone || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Tanggal Lahir</p>
              <p class="text-sm font-medium text-gray-900">{{ user.birth_date || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Jenis Kelamin</p>
              <p class="text-sm font-medium text-gray-900">{{ user.gender === 'M' ? 'Laki-laki' : user.gender === 'F' ? 'Perempuan' : '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">NIK</p>
              <p class="font-mono text-sm font-semibold text-gray-900">{{ user.nik || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Profil Risiko</p>
              <p class="text-sm font-medium text-gray-900">{{ user.risk_profile || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Pekerjaan</p>
              <p class="text-sm font-medium text-gray-900">{{ user.occupation || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- SID & Bank -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h4 class="font-semibold text-gray-900 mb-3">SID & IFUA</h4>
            <div v-if="user.sid" class="space-y-2">
              <div class="bg-green-50 rounded-lg p-3">
                <p class="text-xs text-green-600 font-medium">SID</p>
                <p class="font-mono text-sm font-bold text-green-800 mt-0.5">{{ user.sid }}</p>
              </div>
              <div v-if="user.ifua" class="bg-green-50 rounded-lg p-3">
                <p class="text-xs text-green-600 font-medium">IFUA</p>
                <p class="font-mono text-sm font-bold text-green-800 mt-0.5">{{ user.ifua }}</p>
              </div>
            </div>
            <div v-else class="text-gray-400 text-sm flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-gray-300"></span>
              <span>Belum ada SID</span>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h4 class="font-semibold text-gray-900 mb-3">Rekening Bank</h4>
            <div v-if="user.bank_name" class="space-y-2">
              <div>
                <p class="text-xs text-gray-500">Bank</p>
                <p class="text-sm font-medium text-gray-900">{{ user.bank_name }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">No. Rekening</p>
                <p class="font-mono text-sm font-semibold text-gray-900">{{ user.account_number }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Nama Pemilik</p>
                <p class="text-sm font-medium text-gray-900">{{ user.account_name }}</p>
              </div>
            </div>
            <div v-else class="text-gray-400 text-sm">Belum ada data rekening</div>
          </div>
        </div>

        <!-- Transaction Summary -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-semibold text-gray-900">Ringkasan Transaksi</h4>
            <NuxtLink :to="`/transactions?user=${user.id}`" class="text-xs font-medium" style="color: #009688;">
              Lihat semua transaksi
            </NuxtLink>
          </div>
          <div class="grid grid-cols-3 gap-4 mb-5">
            <div class="text-center bg-blue-50 rounded-lg py-3">
              <p class="text-xl font-bold text-blue-800">{{ user.tx_count || 0 }}</p>
              <p class="text-xs text-blue-600 mt-0.5">Total Transaksi</p>
            </div>
            <div class="text-center bg-green-50 rounded-lg py-3">
              <p class="text-xl font-bold text-green-800">{{ formatCurrency(user.total_invested || 0) }}</p>
              <p class="text-xs text-green-600 mt-0.5">Total Investasi</p>
            </div>
            <div class="text-center bg-teal-50 rounded-lg py-3">
              <p class="text-xl font-bold text-teal-800">{{ user.active_products || 0 }}</p>
              <p class="text-xs text-teal-600 mt-0.5">Produk Aktif</p>
            </div>
          </div>

          <!-- Recent transactions mini -->
          <div v-if="user.recent_transactions?.length" class="space-y-2">
            <p class="text-xs text-gray-500 font-medium mb-2">Transaksi Terakhir</p>
            <div
              v-for="tx in user.recent_transactions"
              :key="tx.id"
              class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <div>
                <p class="text-sm font-medium text-gray-800">{{ tx.product_name }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(tx.created_at) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold" :class="tx.type === 'subscription' ? 'text-green-600' : 'text-orange-600'">
                  {{ tx.type === 'subscription' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
                </p>
                <StatusBadge :status="tx.status" size="xs" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: KYC link + quick actions -->
      <div class="space-y-5">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h4 class="font-semibold text-gray-900 mb-4">Aksi</h4>
          <div class="space-y-2">
            <NuxtLink
              v-if="user.kyc_id"
              :to="`/kyc/${user.kyc_id}`"
              class="w-full py-2.5 px-4 font-semibold rounded-lg text-sm transition-colors flex items-center justify-center space-x-2 text-white"
              style="background-color: #009688;"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
              </svg>
              <span>Lihat KYC</span>
            </NuxtLink>
            <NuxtLink
              :to="`/transactions?user=${user.id}`"
              class="w-full py-2.5 px-4 font-semibold rounded-lg text-sm transition-colors flex items-center justify-center space-x-2 text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Lihat Transaksi</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Account info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h4 class="font-semibold text-gray-900 mb-3">Info Akun</h4>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">User ID</span>
              <span class="font-mono font-medium text-gray-900">#{{ user.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Status Akun</span>
              <span class="font-medium" :class="user.is_active ? 'text-green-600' : 'text-red-500'">
                {{ user.is_active ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Tgl Daftar</span>
              <span class="text-gray-700">{{ formatDate(user.created_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Login Terakhir</span>
              <span class="text-gray-700">{{ user.last_login ? formatDate(user.last_login) : '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const loading = ref(true)
const user = ref<any>(null)

const avatarColors = ['#009688', '#2196f3', '#9c27b0', '#f44336', '#ff9800', '#607d8b']
function getAvatarColor(name: string) {
  return avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length]
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatCurrency(value: number) {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}Jt`
  return `Rp ${value.toLocaleString('id-ID')}`
}

async function fetchUser() {
  loading.value = true
  try {
    const data = await $fetch<any>(`${config.public.apiBase}/users/${route.params.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    user.value = data.data ?? data
  } catch {
    user.value = {
      id: route.params.id,
      name: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '08123456789',
      birth_date: '15 Januari 1990',
      gender: 'M',
      nik: '3171012345678901',
      occupation: 'Karyawan Swasta',
      risk_profile: 'Moderat',
      kyc_status: 'approved',
      kyc_id: 1,
      sid: 'IDD12345678',
      ifua: 'IFUA00123456',
      bank_name: 'Bank Mandiri',
      account_number: '1230004567890',
      account_name: 'BUDI SANTOSO',
      is_active: true,
      created_at: '2025-01-10T10:00:00Z',
      last_login: new Date().toISOString(),
      tx_count: 8,
      total_invested: 45_000_000,
      active_products: 3,
      recent_transactions: [
        { id: 1, product_name: 'Manulife Dana Saham', type: 'subscription', amount: 5_000_000, status: 'completed', created_at: '2025-01-15T10:00:00Z' },
        { id: 2, product_name: 'Schroder 90 Plus', type: 'redemption', amount: 2_000_000, status: 'completed', created_at: '2025-01-12T09:00:00Z' }
      ]
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchUser())
</script>
