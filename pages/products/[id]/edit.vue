<template>
  <div class="space-y-5">
    <div class="flex items-center space-x-3">
      <NuxtLink to="/products" class="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h2 class="text-xl font-bold text-gray-900">Edit Produk</h2>
        <p class="text-sm text-gray-500">Perbarui data produk reksa dana</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loadingData" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div class="animate-pulse space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div v-for="n in 8" :key="n" class="space-y-1">
            <div class="h-3 bg-gray-100 rounded w-1/3"></div>
            <div class="h-9 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div class="xl:col-span-2 space-y-5">
        <!-- Basic Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-5">Informasi Dasar</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Kode Produk <span class="text-red-500">*</span></label>
              <input
                v-model="form.fund_code"
                type="text"
                required
                maxlength="10"
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent uppercase"
                @input="form.fund_code = form.fund_code.toUpperCase()"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Jenis Reksa Dana <span class="text-red-500">*</span></label>
              <select
                v-model="form.fund_type"
                required
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Pilih jenis...</option>
                <option value="saham">Reksa Dana Saham</option>
                <option value="pendapatan_tetap">Reksa Dana Pendapatan Tetap</option>
                <option value="campuran">Reksa Dana Campuran</option>
                <option value="pasar_uang">Reksa Dana Pasar Uang</option>
                <option value="index">Reksa Dana Indeks</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Produk <span class="text-red-500">*</span></label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Manajer Investasi <span class="text-red-500">*</span></label>
              <select
                v-model="form.investment_manager_id"
                required
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Pilih MI...</option>
                <option v-for="mi in investmentManagers" :key="mi.id" :value="mi.id">{{ mi.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Bank Kustodian <span class="text-red-500">*</span></label>
              <input
                v-model="form.custodian_bank"
                type="text"
                required
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Financial Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-5">Data Keuangan</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">NAV per Unit (Rp) <span class="text-red-500">*</span></label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">Rp</span>
                <input
                  v-model.number="form.nav_per_unit"
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Min. Pembelian (Rp) <span class="text-red-500">*</span></label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">Rp</span>
                <input
                  v-model.number="form.min_subscription"
                  type="number"
                  required
                  min="0"
                  class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Biaya Pengelolaan (%)</label>
              <div class="relative">
                <input
                  v-model.number="form.management_fee"
                  type="number"
                  min="0"
                  max="5"
                  step="0.01"
                  class="w-full pr-8 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-5">Deskripsi Produk</h3>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          ></textarea>
        </div>
      </div>

      <!-- Right sidebar -->
      <div class="space-y-5">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-4">Opsi Produk</h3>
          <div class="space-y-4">
            <label class="flex items-center space-x-3 cursor-pointer">
              <div
                class="relative w-10 h-5 rounded-full transition-colors cursor-pointer"
                :class="form.is_active ? 'bg-teal-500' : 'bg-gray-200'"
                @click="form.is_active = !form.is_active"
              >
                <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                  :class="form.is_active ? 'translate-x-5' : 'translate-x-0'"></div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Status Aktif</p>
                <p class="text-xs text-gray-400">Produk dapat dibeli investor</p>
              </div>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <div
                class="relative w-10 h-5 rounded-full transition-colors cursor-pointer"
                :class="form.is_syariah ? 'bg-green-500' : 'bg-gray-200'"
                @click="form.is_syariah = !form.is_syariah"
              >
                <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                  :class="form.is_syariah ? 'translate-x-5' : 'translate-x-0'"></div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Produk Syariah</p>
                <p class="text-xs text-gray-400">Sesuai prinsip syariah Islam</p>
              </div>
            </label>
          </div>
        </div>

        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-xl p-4">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-xl p-4">
          <p class="text-sm text-green-600">{{ successMessage }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
          <button
            type="submit"
            :disabled="submitting"
            class="w-full py-2.5 px-4 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-60 flex items-center justify-center space-x-2"
            style="background-color: #009688;"
          >
            <svg v-if="!submitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span>{{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
          </button>
          <NuxtLink
            to="/products"
            class="w-full py-2.5 px-4 text-gray-700 font-medium rounded-lg text-sm bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            Batal
          </NuxtLink>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'admin'] })

const route = useRoute()
const config = useRuntimeConfig()
const authStore = useAuthStore()
const router = useRouter()

const loadingData = ref(true)
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  fund_code: '',
  name: '',
  investment_manager_id: '' as number | string,
  custodian_bank: '',
  fund_type: '',
  nav_per_unit: null as number | null,
  min_subscription: 10000,
  management_fee: null as number | null,
  description: '',
  is_active: true,
  is_syariah: false
})

const investmentManagers = ref([
  { id: 1, name: 'Manulife Aset Manajemen' },
  { id: 2, name: 'Schroder Investment Management Indonesia' },
  { id: 3, name: 'Mandiri Investasi' },
  { id: 4, name: 'Bahana TCW Investment Management' },
  { id: 5, name: 'Danareksa Investment Management' },
  { id: 6, name: 'BNI Asset Management' },
  { id: 7, name: 'Eastspring Investments Indonesia' },
  { id: 8, name: 'Trimegah Asset Management' }
])

async function fetchProduct() {
  loadingData.value = true
  try {
    const data = await $fetch<any>(`${config.public.apiBase}/products/${route.params.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const p = data.data ?? data
    Object.assign(form, {
      fund_code: p.fund_code,
      name: p.name,
      investment_manager_id: p.investment_manager_id,
      custodian_bank: p.custodian_bank,
      fund_type: p.fund_type,
      nav_per_unit: p.nav_per_unit,
      min_subscription: p.min_subscription,
      management_fee: p.management_fee,
      description: p.description,
      is_active: p.is_active,
      is_syariah: p.is_syariah
    })
  } catch {
    Object.assign(form, {
      fund_code: 'MLDNS',
      name: 'Manulife Dana Saham',
      investment_manager_id: 1,
      custodian_bank: 'Bank Mandiri',
      fund_type: 'saham',
      nav_per_unit: 8750,
      min_subscription: 10000,
      management_fee: 1.5,
      description: 'Reksa dana saham yang dikelola secara aktif dengan tujuan pertumbuhan modal jangka panjang.',
      is_active: true,
      is_syariah: false
    })
  } finally {
    loadingData.value = false
  }
}

async function handleSubmit() {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    await $fetch(`${config.public.apiBase}/products/${route.params.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: form
    })
    successMessage.value = 'Produk berhasil diperbarui!'
    setTimeout(() => router.push('/products'), 1500)
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Gagal memperbarui produk.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => fetchProduct())
</script>
