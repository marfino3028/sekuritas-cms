<template>
  <div class="space-y-5">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Laporan</h2>
      <p class="text-sm text-gray-500 mt-0.5">Unduh laporan transaksi, AUM, dan KYC</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      <div
        v-for="report in reports"
        :key="report.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start space-x-4">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="report.iconBg">
            <component :is="report.icon" class="w-5 h-5" :class="report.iconColor" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">{{ report.title }}</h3>
            <p class="text-xs text-gray-500 mt-0.5 mb-4">{{ report.description }}</p>

            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-1.5">
                <input
                  :id="`from-${report.id}`"
                  v-model="report.dateFrom"
                  type="date"
                  class="flex-1 min-w-[120px] px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <span class="text-gray-400 text-xs">–</span>
                <input
                  :id="`to-${report.id}`"
                  v-model="report.dateTo"
                  type="date"
                  class="flex-1 min-w-[120px] px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <button
                @click="downloadReport(report)"
                :disabled="report.downloading"
                class="w-full py-2 text-sm font-medium text-white rounded-lg transition-all disabled:opacity-60 flex items-center justify-center space-x-2 hover:shadow-md"
                style="background: linear-gradient(135deg, #1E56C9, #0B2A5B);"
              >
                <svg v-if="!report.downloading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <svg v-else class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>{{ report.downloading ? 'Menyiapkan...' : 'Unduh Excel' }}</span>
              </button>
            </div>
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

const today = new Date().toISOString().split('T')[0]
const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

const reports = ref([
  {
    id: 'transactions',
    title: 'Laporan Transaksi',
    description: 'Ekspor seluruh transaksi pembelian, penjualan, dan switching dalam rentang tanggal.',
    endpoint: '/reports/transactions',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    dateFrom: monthStart,
    dateTo: today,
    downloading: false,
    icon: { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>` }
  },
  {
    id: 'kyc',
    title: 'Laporan KYC',
    description: 'Data pengajuan KYC, status verifikasi, dan SID yang telah digenerate.',
    endpoint: '/reports/kyc',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    dateFrom: monthStart,
    dateTo: today,
    downloading: false,
    icon: { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/></svg>` }
  },
  {
    id: 'aum',
    title: 'Laporan AUM',
    description: 'Ringkasan Asset Under Management per produk dan per investor.',
    endpoint: '/reports/aum',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    dateFrom: monthStart,
    dateTo: today,
    downloading: false,
    icon: { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>` }
  },
  {
    id: 'users',
    title: 'Laporan User',
    description: 'Data pengguna terdaftar, status akun, dan ringkasan portofolio.',
    endpoint: '/reports/users',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    dateFrom: monthStart,
    dateTo: today,
    downloading: false,
    icon: { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>` }
  },
  {
    id: 'nav',
    title: 'Laporan NAV',
    description: 'Riwayat NAV per unit untuk setiap produk reksa dana.',
    endpoint: '/reports/nav',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    dateFrom: monthStart,
    dateTo: today,
    downloading: false,
    icon: { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>` }
  }
])

async function downloadReport(report: any) {
  report.downloading = true
  try {
    const params = new URLSearchParams({ date_from: report.dateFrom, date_to: report.dateTo })
    const response = await fetch(`${config.public.apiBase}${report.endpoint}?${params}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    if (!response.ok) throw new Error('Download failed')

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${report.id}-${report.dateFrom}-${report.dateTo}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    alert(`Laporan "${report.title}" tidak dapat diunduh saat ini. Backend belum terhubung.`)
  } finally {
    report.downloading = false
  }
}
</script>
