<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Dashboard</h2>
        <p class="text-sm text-gray-500 mt-0.5">Ringkasan aktivitas platform investasi</p>
      </div>
      <div class="text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
        {{ formatDate(new Date()) }}
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <StatsCard
        title="Total Users"
        :value="stats.totalUsers"
        :loading="loadingStats"
        color="blue"
        trend="+12% bulan ini"
        trend-up
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </template>
      </StatsCard>

      <StatsCard
        title="Pending KYC"
        :value="stats.pendingKyc"
        :loading="loadingStats"
        color="yellow"
        trend="Perlu ditinjau"
        :trend-up="false"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </StatsCard>

      <StatsCard
        title="Active Investors"
        :value="stats.activeInvestors"
        :loading="loadingStats"
        color="teal"
        trend="+5% bulan ini"
        trend-up
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </StatsCard>

      <StatsCard
        title="Total AUM"
        :value="formatAUM(stats.totalAum)"
        :loading="loadingStats"
        color="purple"
        trend="+8.3% bulan ini"
        trend-up
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </StatsCard>
    </div>

    <!-- Two column section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Recent KYC Submissions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-900">KYC Terbaru</h3>
            <p class="text-xs text-gray-500 mt-0.5">Pengajuan KYC yang baru masuk</p>
          </div>
          <NuxtLink
            to="/kyc?filter=pending"
            class="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
            style="color: #009688; border-color: #009688;"
          >
            Lihat Semua
          </NuxtLink>
        </div>

        <div v-if="loadingKyc" class="p-6 space-y-3">
          <div v-for="n in 4" :key="n" class="animate-pulse flex items-center space-x-3">
            <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-1">
              <div class="h-3 bg-gray-200 rounded w-3/4"></div>
              <div class="h-2 bg-gray-100 rounded w-1/2"></div>
            </div>
            <div class="h-5 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <div
            v-for="kyc in recentKyc"
            :key="kyc.id"
            class="px-5 py-3.5 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
          >
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              :style="{ backgroundColor: getAvatarColor(kyc.name) }">
              {{ kyc.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ kyc.name }}</p>
              <p class="text-xs text-gray-400">{{ kyc.submitted_at }}</p>
            </div>
            <StatusBadge :status="kyc.status" />
            <NuxtLink :to="`/kyc/${kyc.id}`" class="text-xs text-teal-600 hover:text-teal-700 font-medium ml-2">
              Detail
            </NuxtLink>
          </div>

          <div v-if="recentKyc.length === 0" class="px-5 py-8 text-center text-gray-400">
            <svg class="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-sm">Belum ada pengajuan KYC</p>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-900">Transaksi Terbaru</h3>
            <p class="text-xs text-gray-500 mt-0.5">Aktivitas transaksi terkini</p>
          </div>
          <NuxtLink
            to="/transactions"
            class="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
            style="color: #009688; border-color: #009688;"
          >
            Lihat Semua
          </NuxtLink>
        </div>

        <div v-if="loadingTransactions" class="p-6 space-y-3">
          <div v-for="n in 4" :key="n" class="animate-pulse flex items-center space-x-3">
            <div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div class="flex-1 space-y-1">
              <div class="h-3 bg-gray-200 rounded w-3/4"></div>
              <div class="h-2 bg-gray-100 rounded w-1/2"></div>
            </div>
            <div class="h-3 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <div
            v-for="tx in recentTransactions"
            :key="tx.id"
            class="px-5 py-3.5 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="tx.type === 'subscription' ? 'bg-green-100' : 'bg-orange-100'">
              <svg v-if="tx.type === 'subscription'" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <svg v-else class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ tx.user_name }}</p>
              <p class="text-xs text-gray-400">{{ tx.product_name }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold" :class="tx.type === 'subscription' ? 'text-green-600' : 'text-orange-600'">
                {{ tx.type === 'subscription' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
              </p>
              <StatusBadge :status="tx.status" size="xs" />
            </div>
          </div>

          <div v-if="recentTransactions.length === 0" class="px-5 py-8 text-center text-gray-400">
            <svg class="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-sm">Belum ada transaksi</p>
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

const loadingStats = ref(true)
const loadingKyc = ref(true)
const loadingTransactions = ref(true)

const stats = ref({
  totalUsers: 0,
  pendingKyc: 0,
  activeInvestors: 0,
  totalAum: 0
})

const recentKyc = ref<any[]>([])
const recentTransactions = ref<any[]>([])

const avatarColors = ['#009688', '#2196f3', '#9c27b0', '#f44336', '#ff9800', '#607d8b']
function getAvatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length]
}

function formatDate(date: Date) {
  return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatAUM(value: number) {
  if (value >= 1_000_000_000_000) return `Rp ${(value / 1_000_000_000_000).toFixed(1)}T`
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}Jt`
  return `Rp ${value.toLocaleString('id-ID')}`
}

function formatCurrency(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}Jt`
  return value.toLocaleString('id-ID')
}

async function fetchDashboardData() {
  const headers = { Authorization: `Bearer ${authStore.token}` }

  try {
    const data = await $fetch<any>(`${config.public.apiBase}/dashboard`, { headers })
    stats.value = {
      totalUsers: data.total_users ?? 0,
      pendingKyc: data.pending_kyc ?? 0,
      activeInvestors: data.active_investors ?? 0,
      totalAum: data.total_aum ?? 0
    }
  } catch {
    // Use mock data for demo
    stats.value = { totalUsers: 1284, pendingKyc: 23, activeInvestors: 876, totalAum: 125_000_000_000 }
  } finally {
    loadingStats.value = false
  }

  try {
    const data = await $fetch<any[]>(`${config.public.apiBase}/kyc?status=all&per_page=5`, { headers })
    recentKyc.value = Array.isArray(data) ? data : data?.data ?? []
  } catch {
    recentKyc.value = [
      { id: 1, name: 'Budi Santoso', status: 'pending', submitted_at: '2 jam lalu' },
      { id: 2, name: 'Siti Rahayu', status: 'approved', submitted_at: '5 jam lalu' },
      { id: 3, name: 'Ahmad Fauzi', status: 'pending', submitted_at: '1 hari lalu' },
      { id: 4, name: 'Dewi Lestari', status: 'rejected', submitted_at: '1 hari lalu' }
    ]
  } finally {
    loadingKyc.value = false
  }

  try {
    const data = await $fetch<any[]>(`${config.public.apiBase}/transactions?per_page=5`, { headers })
    recentTransactions.value = Array.isArray(data) ? data : data?.data ?? []
  } catch {
    recentTransactions.value = [
      { id: 1, user_name: 'Budi Santoso', product_name: 'Manulife Dana Saham', type: 'subscription', amount: 5_000_000, status: 'completed' },
      { id: 2, user_name: 'Siti Rahayu', product_name: 'Schroder 90 Plus', type: 'redemption', amount: 2_500_000, status: 'pending' },
      { id: 3, user_name: 'Ahmad Fauzi', product_name: 'Mandiri Pasar Uang', type: 'subscription', amount: 10_000_000, status: 'completed' },
      { id: 4, user_name: 'Rina Andriani', product_name: 'Bahana MES Pendapatan Tetap', type: 'subscription', amount: 3_000_000, status: 'pending' }
    ]
  } finally {
    loadingTransactions.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
