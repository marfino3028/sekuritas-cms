<template>
  <div class="space-y-5">
    <!-- Back button & header -->
    <div class="flex items-center space-x-3">
      <NuxtLink to="/kyc" class="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h2 class="text-xl font-bold text-gray-900">Detail KYC</h2>
        <p class="text-sm text-gray-500">Review dan proses verifikasi identitas investor</p>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div class="xl:col-span-2 space-y-5">
        <div v-for="n in 3" :key="n" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div class="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="m in 4" :key="m" class="space-y-1">
              <div class="h-3 bg-gray-100 rounded w-1/2"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-5">
        <div v-for="n in 2" :key="n" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div class="space-y-3">
            <div class="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="kyc" class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <!-- Left column: main data -->
      <div class="xl:col-span-2 space-y-5">
        <!-- Status banner -->
        <div
          class="rounded-xl p-4 flex items-center justify-between"
          :class="{
            'bg-yellow-50 border border-yellow-200': kyc.status === 'pending',
            'bg-green-50 border border-green-200': kyc.status === 'approved',
            'bg-red-50 border border-red-200': kyc.status === 'rejected'
          }"
        >
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="{
                'bg-yellow-100': kyc.status === 'pending',
                'bg-green-100': kyc.status === 'approved',
                'bg-red-100': kyc.status === 'rejected'
              }"
            >
              <svg v-if="kyc.status === 'pending'" class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="kyc.status === 'approved'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-gray-800">
                Status KYC: <StatusBadge :status="kyc.status" class="ml-1" />
              </p>
              <p class="text-xs text-gray-500 mt-0.5">
                Diajukan {{ formatDate(kyc.submitted_at) }} · Diproses oleh {{ kyc.reviewed_by || 'Belum diproses' }}
              </p>
            </div>
          </div>
          <div v-if="kyc.status === 'rejected' && kyc.rejection_reason" class="text-right">
            <p class="text-xs text-red-500 font-medium">Alasan Penolakan:</p>
            <p class="text-xs text-red-600 mt-0.5 max-w-xs">{{ kyc.rejection_reason }}</p>
          </div>
        </div>

        <!-- User Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Informasi Pengguna</span>
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <InfoField label="Nama Lengkap" :value="kyc.name" />
            <InfoField label="No. Telepon" :value="kyc.phone" />
            <InfoField label="Email" :value="kyc.email" />
          </div>
        </div>

        <!-- KYC Data -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            <span>Data KYC</span>
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p class="text-xs text-gray-500 mb-1">NIK</p>
              <p class="font-mono text-sm font-semibold text-gray-900">{{ kyc.nik }}</p>
            </div>
            <InfoField label="Tanggal Lahir" :value="kyc.birth_date" />
            <InfoField label="Jenis Kelamin" :value="kyc.gender === 'M' ? 'Laki-laki' : 'Perempuan'" />
            <InfoField label="Status Perkawinan" :value="maritalLabels[kyc.marital_status] || kyc.marital_status" />
            <InfoField label="Pendidikan Terakhir" :value="kyc.education" />
            <InfoField label="Pekerjaan" :value="kyc.occupation" />
            <InfoField label="Penghasilan Per Tahun" :value="kyc.annual_income" />
            <InfoField label="Sumber Dana" :value="kyc.source_of_fund" />
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100">
            <InfoField label="Alamat Lengkap" :value="kyc.address" />
          </div>
        </div>

        <!-- Risk Profile -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Profil Risiko</span>
          </h3>
          <div class="flex items-center space-x-4">
            <div
              class="px-4 py-2 rounded-lg font-semibold text-sm"
              :class="riskProfileClass(kyc.risk_profile)"
            >{{ kyc.risk_profile || 'Belum ada' }}</div>
            <p class="text-sm text-gray-500">{{ riskProfileDesc(kyc.risk_profile) }}</p>
          </div>
        </div>

        <!-- Bank Data -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Data Rekening</span>
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <InfoField label="Bank" :value="kyc.bank_name" />
            <div>
              <p class="text-xs text-gray-500 mb-1">No. Rekening</p>
              <p class="font-mono text-sm font-semibold text-gray-900">{{ kyc.account_number }}</p>
            </div>
            <InfoField label="Nama Pemilik Rekening" :value="kyc.account_name" />
          </div>
        </div>
      </div>

      <!-- Right column: documents, SID, actions -->
      <div class="space-y-5">
        <!-- Document Preview -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-4">Dokumen KYC</h3>
          <div class="space-y-4">
            <div>
              <p class="text-xs text-gray-500 mb-2 font-medium">Foto KTP</p>
              <div
                class="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
                @click="openImage(kyc.ktp_photo)"
              >
                <img
                  v-if="kyc.ktp_photo"
                  :src="kyc.ktp_photo"
                  alt="KTP"
                  class="w-full h-36 object-cover group-hover:opacity-90 transition-opacity"
                  @error="(e) => (e.target as HTMLImageElement).src = '/placeholder-ktp.jpg'"
                />
                <div v-else class="h-36 flex flex-col items-center justify-center text-gray-400">
                  <svg class="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                  </svg>
                  <p class="text-xs">Tidak ada foto KTP</p>
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
                  <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-2 font-medium">Foto Selfie + KTP</p>
              <div
                class="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
                @click="openImage(kyc.selfie_photo)"
              >
                <img
                  v-if="kyc.selfie_photo"
                  :src="kyc.selfie_photo"
                  alt="Selfie"
                  class="w-full h-36 object-cover group-hover:opacity-90 transition-opacity"
                  @error="(e) => (e.target as HTMLImageElement).src = '/placeholder-selfie.jpg'"
                />
                <div v-else class="h-36 flex flex-col items-center justify-center text-gray-400">
                  <svg class="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p class="text-xs">Tidak ada foto selfie</p>
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
                  <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hasil eKYC otomatis -->
        <div v-if="kyc.ekyc" class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-900">Verifikasi eKYC Otomatis</h3>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full"
                  :class="{
                    'bg-green-100 text-green-700': kyc.ekyc.result?.decision === 'approved',
                    'bg-amber-100 text-amber-700': kyc.ekyc.result?.decision === 'review',
                    'bg-red-100 text-red-700': kyc.ekyc.result?.decision === 'rejected'
                  }">
              {{ ekycDecisionLabel }}
            </span>
          </div>

          <div class="grid grid-cols-4 gap-2 text-center mb-3">
            <div class="bg-gray-50 rounded-lg py-2">
              <p class="text-[10px] text-gray-400 uppercase tracking-wide">Skor</p>
              <p class="font-bold text-gray-800">{{ kyc.ekyc.result?.final_score ?? kyc.ekyc.score ?? '—' }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg py-2">
              <p class="text-[10px] text-gray-400 uppercase tracking-wide">OCR</p>
              <p class="font-bold text-gray-800">{{ kyc.ekyc.result?.ocr_score ?? '—' }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg py-2">
              <p class="text-[10px] text-gray-400 uppercase tracking-wide">Liveness</p>
              <p class="font-bold text-gray-800">{{ kyc.ekyc.result?.liveness_score ?? '—' }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg py-2">
              <p class="text-[10px] text-gray-400 uppercase tracking-wide">Face</p>
              <p class="font-bold text-gray-800">{{ kyc.ekyc.result?.face_match_score ?? '—' }}</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-1.5 text-xs">
            <span class="px-2 py-0.5 rounded bg-gray-100 text-gray-500">Provider: {{ kyc.ekyc.provider }}</span>
            <span v-if="kyc.ekyc.signature" class="px-2 py-0.5 rounded bg-blue-50 text-blue-600">Tanda tangan: {{ kyc.ekyc.signature.provider }}</span>
          </div>
          <div v-if="kyc.ekyc.result?.flags?.length" class="mt-2 text-xs text-red-600">
            ⚠ Flag: {{ kyc.ekyc.result.flags.join(', ') }}
          </div>
        </div>

        <!-- SID Status -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-3">SID & IFUA</h3>

          <!-- Generating state -->
          <div v-if="generatingSid" class="flex items-center space-x-3 py-3">
            <div class="flex space-x-1">
              <div class="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style="animation-delay: 300ms"></div>
            </div>
            <p class="text-sm text-teal-600 font-medium">Generating SID...</p>
          </div>

          <!-- Has SID -->
          <div v-else-if="kyc.sid || generatedSid" class="space-y-3">
            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
              <p class="text-xs text-green-600 font-medium mb-1">SID</p>
              <p class="font-mono text-sm font-bold text-green-800">{{ generatedSid || kyc.sid }}</p>
            </div>
            <div v-if="kyc.ifua || generatedIfua" class="bg-green-50 border border-green-200 rounded-lg p-3">
              <p class="text-xs text-green-600 font-medium mb-1">IFUA</p>
              <p class="font-mono text-sm font-bold text-green-800">{{ generatedIfua || kyc.ifua }}</p>
            </div>
          </div>

          <!-- No SID -->
          <div v-else>
            <div class="flex items-center space-x-2 text-gray-400">
              <div class="w-2 h-2 rounded-full bg-gray-300"></div>
              <p class="text-sm">SID belum diterbitkan</p>
            </div>

            <!-- Tombol terbitkan SID (langkah 2) — muncul setelah KYC approved -->
            <template v-if="kyc.status === 'approved'">
              <button
                @click="issueSid"
                :disabled="issuingSid"
                class="mt-3 w-full py-2.5 px-4 text-white font-semibold rounded-lg text-sm bg-accent hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/></svg>
                {{ issuingSid ? 'Mengirim…' : 'Kirim ke S-INVEST' }}
              </button>
              <p class="text-xs text-gray-400 mt-1.5">Menerbitkan SID &amp; IFUA nasabah ke sistem S-INVEST (KSEI).</p>
            </template>
            <p v-else class="text-xs text-gray-400 mt-1">SID dapat diterbitkan setelah KYC disetujui.</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="kyc.status === 'pending'" class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-3">Tindakan</h3>
          <div class="space-y-3">
            <button
              @click="showApproveModal = true"
              class="w-full py-2.5 px-4 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center space-x-2"
              style="background-color: #009688;"
              @mouseover="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#00897b')"
              @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#009688')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Approve KYC</span>
            </button>
            <button
              @click="showRejectModal = true"
              class="w-full py-2.5 px-4 text-white font-semibold rounded-lg text-sm bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Reject KYC</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image lightbox -->
    <div
      v-if="lightboxImage"
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      @click="lightboxImage = null"
    >
      <img :src="lightboxImage" class="max-w-full max-h-full rounded-lg shadow-2xl" @click.stop />
      <button @click="lightboxImage = null" class="absolute top-4 right-4 text-white">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Approve Modal -->
    <ConfirmModal
      v-if="showApproveModal"
      title="Approve KYC"
      :message="`Anda akan menyetujui KYC dari ${kyc?.name}. Setelah itu, terbitkan SID lewat tombol 'Kirim ke S-INVEST'.`"
      confirm-label="Ya, Approve"
      confirm-variant="success"
      :loading="actionLoading"
      @confirm="confirmApprove"
      @cancel="showApproveModal = false"
    />

    <!-- Reject Modal -->
    <ConfirmModal
      v-if="showRejectModal"
      title="Tolak KYC"
      :message="`Anda akan menolak KYC dari ${kyc?.name}. Berikan alasan penolakan:`"
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
        class="w-full mt-3 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
      ></textarea>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const loading = ref(true)
const actionLoading = ref(false)
const kyc = ref<any>(null)
const lightboxImage = ref<string | null>(null)
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const rejectReason = ref('')

const ekycDecisionLabel = computed(() => ({
  approved: 'Terverifikasi',
  review: 'Perlu Review',
  rejected: 'Ditolak',
}[kyc.value?.ekyc?.result?.decision as string] || 'Belum ada'))
const generatingSid = ref(false)
const generatedSid = ref('')
const generatedIfua = ref('')

const maritalLabels: Record<string, string> = {
  single: 'Belum Menikah',
  married: 'Menikah',
  divorced: 'Cerai'
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function openImage(url: string) {
  if (url) lightboxImage.value = url
}

function riskProfileClass(profile: string) {
  const map: Record<string, string> = {
    'Konservatif': 'bg-blue-100 text-blue-800',
    'Moderat': 'bg-yellow-100 text-yellow-800',
    'Agresif': 'bg-red-100 text-red-800'
  }
  return map[profile] || 'bg-gray-100 text-gray-800'
}

function riskProfileDesc(profile: string) {
  const map: Record<string, string> = {
    'Konservatif': 'Investor dengan toleransi risiko rendah, cocok untuk produk pasar uang dan pendapatan tetap',
    'Moderat': 'Investor dengan toleransi risiko sedang, cocok untuk produk campuran',
    'Agresif': 'Investor dengan toleransi risiko tinggi, cocok untuk produk saham'
  }
  return map[profile] || ''
}

async function confirmApprove() {
  actionLoading.value = true
  try {
    await $fetch(`${config.public.apiBase}/kyc/${route.params.id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
  } catch { /* demo/offline: tetap tandai approved */ }
  finally {
    kyc.value.status = 'approved'
    showApproveModal.value = false
    actionLoading.value = false
  }
}

// LANGKAH 2 — terbitkan SID ke S-INVEST (dipicu manual oleh ops)
const issuingSid = ref(false)
async function issueSid() {
  issuingSid.value = true
  generatingSid.value = true
  try {
    const res = await $fetch<any>(`${config.public.apiBase}/kyc/${route.params.id}/issue-sid`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    generatedSid.value = res?.data?.sid_number || generateSidMock()
    generatedIfua.value = res?.data?.ifua_number || generateIfuaMock()
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal menerbitkan SID.')
  } finally {
    generatingSid.value = false
    issuingSid.value = false
  }
}

async function confirmReject() {
  if (!rejectReason.value.trim()) {
    alert('Mohon isi alasan penolakan.')
    return
  }
  actionLoading.value = true
  try {
    await $fetch(`${config.public.apiBase}/kyc/${route.params.id}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { reason: rejectReason.value }
    })
    kyc.value.status = 'rejected'
    kyc.value.rejection_reason = rejectReason.value
    showRejectModal.value = false
  } catch {
    kyc.value.status = 'rejected'
    kyc.value.rejection_reason = rejectReason.value
    showRejectModal.value = false
  } finally {
    actionLoading.value = false
  }
}

function generateSidMock() {
  return 'IDD' + Math.random().toString(36).toUpperCase().slice(2, 10)
}

function generateIfuaMock() {
  return 'IFUA' + Date.now().toString().slice(-8)
}

async function fetchKyc() {
  loading.value = true
  try {
    const data = await $fetch<any>(`${config.public.apiBase}/kyc/${route.params.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    kyc.value = data.data ?? data
  } catch {
    kyc.value = {
      id: route.params.id,
      name: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '08123456789',
      nik: '3171012345678901',
      birth_date: '15 Januari 1990',
      gender: 'M',
      marital_status: 'married',
      education: 'S1',
      occupation: 'Karyawan Swasta',
      annual_income: 'Rp 50–100 Juta/Tahun',
      source_of_fund: 'Gaji',
      address: 'Jl. Sudirman No. 45, RT 003/RW 002, Kel. Senayan, Kec. Kebayoran Baru, Jakarta Selatan 12190',
      risk_profile: 'Moderat',
      bank_name: 'Bank Mandiri',
      account_number: '1230004567890',
      account_name: 'BUDI SANTOSO',
      ktp_photo: null,
      selfie_photo: null,
      sid: null,
      ifua: null,
      status: 'pending',
      submitted_at: new Date().toISOString(),
      reviewed_by: null,
      rejection_reason: null
    }
  } finally {
    loading.value = false
  }
}

// InfoField inline component
const InfoField = defineComponent({
  props: { label: String, value: String },
  template: `<div><p class="text-xs text-gray-500 mb-1">{{ label }}</p><p class="text-sm font-medium text-gray-900">{{ value || '-' }}</p></div>`
})

onMounted(() => fetchKyc())
</script>
