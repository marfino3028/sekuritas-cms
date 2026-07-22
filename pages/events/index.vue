<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Event &amp; Promo</h2>
        <p class="text-sm text-gray-500 mt-0.5">Kelola event dengan kode/link referral & reward</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Tambah Event
      </button>
    </div>

    <!-- List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-400 text-sm">Memuat…</div>
      <div v-else-if="!events.length" class="p-10 text-center text-gray-400 text-sm">Belum ada event. Klik "Tambah Event".</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-500">
          <tr>
            <th class="text-left font-medium px-4 py-3">Event</th>
            <th class="text-left font-medium px-4 py-3">Kode / Link</th>
            <th class="text-left font-medium px-4 py-3">Periode</th>
            <th class="text-left font-medium px-4 py-3">Peserta</th>
            <th class="text-left font-medium px-4 py-3">Status</th>
            <th class="text-right font-medium px-4 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in events" :key="e.id" class="border-t border-gray-50">
            <td class="px-4 py-3">
              <p class="font-semibold text-gray-800">{{ e.name }}</p>
              <p class="text-xs text-gray-400">{{ e.investment_manager }} · {{ e.event_type }}</p>
            </td>
            <td class="px-4 py-3">
              <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{{ e.code }}</code>
              <button class="ml-2 text-xs text-accent hover:underline" @click="copyLink(e.code)">
                {{ copied === e.code ? '✓ Tersalin' : 'Salin link' }}
              </button>
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs">{{ e.start_at }}<br>s/d {{ e.end_at }}</td>
            <td class="px-4 py-3 text-gray-600">{{ e.registered_count }}<span v-if="e.reward_quota" class="text-gray-400"> · 🎁{{ e.reward_quota }}</span></td>
            <td class="px-4 py-3">
              <button @click="toggle(e)" class="text-xs font-semibold px-2 py-1 rounded-full"
                :class="e.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                {{ e.is_active ? 'Aktif' : 'Nonaktif' }}
              </button>
            </td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <button class="text-xs text-accent hover:underline" @click="openLeaderboard(e)">Leaderboard</button>
              <button class="text-xs text-gray-500 hover:underline ml-3" @click="openEdit(e)">Edit</button>
              <button class="text-xs text-red-500 hover:underline ml-3" @click="remove(e)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Leaderboard modal -->
    <div v-if="showLeaderboard" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="showLeaderboard = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-start justify-between mb-1">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Leaderboard — {{ lbEvent?.name }}</h3>
            <p class="text-xs text-gray-400">Kode {{ lbEvent?.code }} · {{ lbEvent?.registered_count }} peserta<span v-if="lbEvent?.reward_quota"> · reward untuk rank ≤ {{ lbEvent?.reward_quota }}</span></p>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn-secondary text-xs" :disabled="exporting" @click="exportCsv">{{ exporting ? '…' : 'Export CSV' }}</button>
            <button class="text-gray-400 hover:text-gray-600" @click="showLeaderboard = false">✕</button>
          </div>
        </div>
        <div v-if="lbLoading" class="py-8 text-center text-gray-400 text-sm">Memuat…</div>
        <div v-else-if="!leaderboard.length" class="py-8 text-center text-gray-400 text-sm">Belum ada pendaftar.</div>
        <table v-else class="w-full text-sm mt-3">
          <thead class="text-gray-400"><tr>
            <th class="text-left font-medium py-2 w-10">#</th>
            <th class="text-left font-medium py-2">Nasabah</th>
            <th class="text-left font-medium py-2">Status</th>
            <th class="text-left font-medium py-2">Waktu Daftar</th>
          </tr></thead>
          <tbody>
            <tr v-for="r in leaderboard" :key="r.rank" class="border-t border-gray-50">
              <td class="py-2 font-bold" :class="r.is_reward_eligible ? 'text-accent' : 'text-gray-400'">{{ r.rank }}</td>
              <td class="py-2">
                <p class="font-semibold text-gray-800">{{ r.name }} <span v-if="r.is_reward_eligible">🎁</span></p>
                <p class="text-xs text-gray-400">{{ r.phone || r.email }}</p>
              </td>
              <td class="py-2 text-xs">
                <span class="px-1.5 py-0.5 rounded-full" :class="r.kyc_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">{{ r.kyc_status }}</span>
              </td>
              <td class="py-2 text-xs text-gray-500">{{ r.registered_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create panel -->
    <div v-if="showCreate" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="showCreate = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ editingId ? 'Edit Event' : 'Tambah Event' }}</h3>
        <p v-if="formError" class="mb-3 p-2.5 bg-red-50 text-red-600 text-sm rounded-lg">{{ formError }}</p>
        <div class="space-y-3">
          <div>
            <label class="text-xs font-semibold text-gray-600">Nama Event *</label>
            <input v-model="form.name" class="input-field" placeholder="Webinar Investasi Reksa Dana" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-gray-600">Kode / Referral</label>
              <input v-model="form.code" class="input-field uppercase" placeholder="WEBINAR2026 (opsional)" />
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-600">Tipe *</label>
              <select v-model="form.event_type" class="input-field">
                <option value="webinar">Webinar</option>
                <option value="seminar">Seminar</option>
                <option value="booth">Booth</option>
                <option value="roadshow">Roadshow</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-600">Manajer Investasi *</label>
            <input v-model="form.investment_manager" class="input-field" placeholder="Victoria Manajemen Investasi" />
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-600">Deskripsi</label>
            <textarea v-model="form.description" rows="2" class="input-field" placeholder="Detail event…"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-gray-600">Mulai *</label>
              <input v-model="form.start_at" type="datetime-local" class="input-field" />
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-600">Selesai *</label>
              <input v-model="form.end_at" type="datetime-local" class="input-field" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-gray-600">Kuota Reward</label>
              <input v-model.number="form.reward_quota" type="number" min="1" class="input-field" placeholder="10" />
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-600">Max Peserta</label>
              <input v-model.number="form.max_participants" type="number" min="1" class="input-field" placeholder="100" />
            </div>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-600">Deskripsi Reward</label>
            <input v-model="form.reward_description" class="input-field" placeholder="Cashback Rp50.000 untuk pendaftar pertama" />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-5">
          <button class="btn-secondary" @click="showCreate = false">Batal</button>
          <button class="btn-primary" :disabled="saving" @click="save">{{ saving ? 'Menyimpan…' : (editingId ? 'Simpan Perubahan' : 'Simpan Event') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const authStore = useAuthStore()
const headers = computed(() => ({ Authorization: `Bearer ${authStore.token}` }))

const loading = ref(true)
const events = ref<any[]>([])
const copied = ref('')
const showCreate = ref(false)
const saving = ref(false)
const formError = ref('')
const editingId = ref<number | null>(null)

// ISO/berbagai format -> value input datetime-local (YYYY-MM-DDTHH:mm)
function toLocalInput(v: string | null): string {
  if (!v) return ''
  const d = new Date(v)
  if (isNaN(d.getTime())) return ''
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

const blankForm = () => ({
  name: '', code: '', event_type: 'webinar', investment_manager: '', description: '',
  start_at: '', end_at: '', reward_quota: null as number | null,
  max_participants: null as number | null, reward_description: '', is_active: true,
})
const form = ref(blankForm())

async function fetchEvents() {
  loading.value = true
  try {
    const data = await $fetch<any>(`${config.public.apiBase}/events`, { headers: headers.value })
    events.value = data.data ?? data ?? []
  } catch { events.value = [] } finally { loading.value = false }
}
onMounted(fetchEvents)

function openCreate() { editingId.value = null; form.value = blankForm(); formError.value = ''; showCreate.value = true }

async function openEdit(e: any) {
  editingId.value = e.id
  formError.value = ''
  showCreate.value = true
  form.value = blankForm()
  try {
    const data = await $fetch<any>(`${config.public.apiBase}/events/${e.id}`, { headers: headers.value })
    const d = data.data ?? data
    form.value = {
      name: d.name ?? '', code: d.code ?? '', event_type: d.event_type ?? 'webinar',
      investment_manager: d.investment_manager ?? '', description: d.description ?? '',
      start_at: toLocalInput(d.start_at), end_at: toLocalInput(d.end_at),
      reward_quota: d.reward_quota ?? null, max_participants: d.max_participants ?? null,
      reward_description: d.reward_description ?? '', is_active: !!d.is_active,
    }
  } catch { formError.value = 'Gagal memuat data event.' }
}

async function save() {
  formError.value = ''
  saving.value = true
  try {
    const payload: any = { ...form.value }
    if (payload.code) payload.code = payload.code.toUpperCase()
    Object.keys(payload).forEach((k) => (payload[k] === '' || payload[k] === null) && delete payload[k])
    if (editingId.value) {
      await $fetch(`${config.public.apiBase}/events/${editingId.value}`, { method: 'PUT', headers: headers.value, body: payload })
    } else {
      await $fetch(`${config.public.apiBase}/events`, { method: 'POST', headers: headers.value, body: payload })
    }
    showCreate.value = false
    await fetchEvents()
  } catch (e: any) {
    formError.value = e?.data?.message || 'Gagal menyimpan. Periksa kembali isian (tanggal selesai harus setelah mulai).'
  } finally { saving.value = false }
}

async function toggle(e: any) {
  try {
    await $fetch(`${config.public.apiBase}/events/${e.id}/toggle`, { method: 'PUT', headers: headers.value })
    e.is_active = !e.is_active
  } catch { /* ignore */ }
}

async function remove(e: any) {
  if (!confirm(`Hapus event "${e.name}"?`)) return
  try {
    await $fetch(`${config.public.apiBase}/events/${e.id}`, { method: 'DELETE', headers: headers.value })
    events.value = events.value.filter((x) => x.id !== e.id)
  } catch { /* ignore */ }
}

// ---- Leaderboard ----
const showLeaderboard = ref(false)
const lbLoading = ref(false)
const lbEvent = ref<any>(null)
const leaderboard = ref<any[]>([])
const exporting = ref(false)

async function openLeaderboard(e: any) {
  lbEvent.value = e
  showLeaderboard.value = true
  lbLoading.value = true
  leaderboard.value = []
  try {
    const data = await $fetch<any>(`${config.public.apiBase}/events/${e.id}/leaderboard`, { headers: headers.value })
    lbEvent.value = data.event ?? e
    leaderboard.value = data.leaderboard ?? []
  } catch { leaderboard.value = [] } finally { lbLoading.value = false }
}

async function exportCsv() {
  if (!lbEvent.value) return
  exporting.value = true
  try {
    const blob = await $fetch<Blob>(`${config.public.apiBase}/events/${lbEvent.value.id}/export`, {
      headers: headers.value, responseType: 'blob',
    })
    const url = URL.createObjectURL(blob as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leaderboard-${lbEvent.value.code || lbEvent.value.id}.csv`
    a.click()
    URL.revokeObjectURL(url)
  } catch { /* ignore */ } finally { exporting.value = false }
}

function copyLink(code: string) {
  const link = `${config.public.frontendBase}/promo/${code}`
  navigator.clipboard?.writeText(link)
  copied.value = code
  setTimeout(() => (copied.value = ''), 1500)
}
</script>
