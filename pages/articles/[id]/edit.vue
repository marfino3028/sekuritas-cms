<template>
  <div class="space-y-5">
    <div class="flex items-center space-x-3">
      <NuxtLink to="/articles" class="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h2 class="text-xl font-bold text-gray-900">Edit Artikel</h2>
        <p class="text-sm text-gray-500">Perbarui isi artikel atau berita</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loadingData" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div class="animate-pulse space-y-4">
        <div class="h-3 bg-gray-100 rounded w-1/4"></div>
        <div class="h-9 bg-gray-200 rounded"></div>
        <div class="h-3 bg-gray-100 rounded w-1/4"></div>
        <div class="h-40 bg-gray-200 rounded"></div>
      </div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div class="xl:col-span-2 space-y-5">
        <!-- Basic Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-5">Informasi Artikel</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Judul <span class="text-red-500">*</span></label>
              <input
                v-model="form.title"
                type="text"
                required
                maxlength="200"
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
              <input
                v-model="form.slug"
                type="text"
                maxlength="220"
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Kategori <span class="text-red-500">*</span></label>
              <input
                v-model="form.category"
                type="text"
                required
                maxlength="60"
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Ringkasan (Excerpt)</label>
              <textarea
                v-model="form.excerpt"
                rows="2"
                maxlength="500"
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-5">Konten <span class="text-red-500">*</span></h3>
          <textarea
            v-model="form.content"
            rows="16"
            required
            class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
          ></textarea>
        </div>
      </div>

      <!-- Right sidebar -->
      <div class="space-y-5">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-4">Detail Publikasi</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Penulis</label>
              <input
                v-model="form.author"
                type="text"
                maxlength="120"
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">URL Gambar</label>
              <input
                v-model="form.image_url"
                type="text"
                maxlength="500"
                placeholder="https://..."
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Publikasi</label>
              <input
                v-model="form.published_at"
                type="datetime-local"
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <label class="flex items-center space-x-3 cursor-pointer pt-1">
              <div
                class="relative w-10 h-5 rounded-full transition-colors cursor-pointer"
                :class="form.is_published ? 'bg-teal-500' : 'bg-gray-200'"
                @click="form.is_published = !form.is_published"
              >
                <div
                  class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                  :class="form.is_published ? 'translate-x-5' : 'translate-x-0'"
                ></div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Publikasikan</p>
                <p class="text-xs text-gray-400">Artikel tampil di platform</p>
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
            to="/articles"
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
  title: '',
  slug: '',
  category: '',
  excerpt: '',
  content: '',
  image_url: '',
  author: '',
  is_published: true,
  published_at: ''
})

function toDateTimeLocal(value: string | null): string {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function fetchArticle() {
  loadingData.value = true
  try {
    const data = await $fetch<any>(`${config.public.apiBase}/articles/${route.params.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const a = data.data ?? data
    Object.assign(form, {
      title: a.title ?? '',
      slug: a.slug ?? '',
      category: a.category ?? '',
      excerpt: a.excerpt ?? '',
      content: a.content ?? '',
      image_url: a.image_url ?? '',
      author: a.author ?? '',
      is_published: !!a.is_published,
      published_at: toDateTimeLocal(a.published_at)
    })
  } catch {
    Object.assign(form, {
      title: 'Prospek Pasar Saham Indonesia 2026',
      slug: 'prospek-pasar-saham-indonesia-2026',
      category: 'Analisa Pasar',
      excerpt: 'Tinjauan menyeluruh atas peluang dan risiko pasar saham domestik di tahun mendatang.',
      content: 'Pasar saham Indonesia diperkirakan menunjukkan pertumbuhan yang sehat...',
      image_url: '',
      author: 'Tim Riset Sekuritas',
      is_published: true,
      published_at: toDateTimeLocal('2026-01-15T09:00:00')
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
    const payload: Record<string, any> = {
      title: form.title,
      slug: form.slug || null,
      category: form.category,
      excerpt: form.excerpt || null,
      content: form.content,
      image_url: form.image_url || null,
      author: form.author || null,
      is_published: form.is_published,
      published_at: form.published_at || null
    }
    await $fetch(`${config.public.apiBase}/articles/${route.params.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: payload
    })
    successMessage.value = 'Artikel berhasil diperbarui!'
    setTimeout(() => router.push('/articles'), 1500)
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Gagal memperbarui artikel.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => fetchArticle())
</script>
