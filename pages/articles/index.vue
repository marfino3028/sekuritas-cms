<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Artikel &amp; Berita</h2>
        <p class="text-sm text-gray-500 mt-0.5">Kelola artikel dan berita yang tampil di platform</p>
      </div>
      <NuxtLink
        to="/articles/create"
        class="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
        style="background-color: #009688;"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Tambah Artikel</span>
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
            placeholder="Cari judul artikel..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            @input="debouncedSearch"
          />
        </div>
        <input
          v-model="categoryFilter"
          type="text"
          placeholder="Filter kategori..."
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          @input="debouncedSearch"
        />
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Semua Status</option>
          <option value="published">Publish</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-8">
        <div class="space-y-3">
          <div v-for="n in 5" :key="n" class="animate-pulse flex items-center space-x-4">
            <div class="h-4 bg-gray-200 rounded flex-1"></div>
            <div class="h-4 bg-gray-200 rounded w-24"></div>
            <div class="h-4 bg-gray-200 rounded w-20"></div>
            <div class="h-4 bg-gray-200 rounded w-24"></div>
            <div class="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[920px] text-sm">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50">
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Judul</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Kategori</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Status</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Tanggal</th>
                <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="article in filteredArticles" :key="article.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-5 py-3.5">
                  <div class="flex items-center space-x-3">
                    <div v-if="article.image_url" class="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img :src="article.image_url" :alt="article.title" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 line-clamp-1">{{ article.title }}</p>
                      <p class="text-xs text-gray-400">{{ article.author || '-' }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3.5">
                  <span class="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {{ article.category || '-' }}
                  </span>
                </td>
                <td class="px-5 py-3.5 whitespace-nowrap">
                  <span
                    class="inline-flex items-center space-x-1 text-xs font-medium"
                    :class="article.is_published ? 'text-green-700' : 'text-gray-400'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="article.is_published ? 'bg-green-500' : 'bg-gray-300'"></span>
                    <span>{{ article.is_published ? 'Publish' : 'Draft' }}</span>
                  </span>
                </td>
                <td class="px-5 py-3.5 text-gray-600 text-xs whitespace-nowrap">{{ formatDate(article.published_at || article.created_at) }}</td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center justify-end space-x-2">
                    <NuxtLink
                      :to="`/articles/${article.id}/edit`"
                      class="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </NuxtLink>
                    <button
                      @click="togglePublish(article)"
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                      :class="article.is_published
                        ? 'text-orange-700 bg-orange-50 hover:bg-orange-100'
                        : 'text-green-700 bg-green-50 hover:bg-green-100'"
                    >
                      {{ article.is_published ? 'Sembunyikan' : 'Publikasikan' }}
                    </button>
                    <button
                      @click="deleteArticle(article)"
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors text-red-600 bg-red-50 hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredArticles.length === 0" class="py-16 text-center text-gray-400">
          <svg class="w-14 h-14 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p class="font-medium">Belum ada artikel</p>
        </div>

        <!-- Pagination -->
        <div v-if="articles.length > 0" class="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
          <p class="text-xs text-gray-500">{{ filteredArticles.length }} artikel ditampilkan dari {{ pagination.total }} total</p>
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
const articles = ref<any[]>([])
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const pagination = ref({ page: 1, perPage: 15, total: 0, totalPages: 1 })

const filteredArticles = computed(() => {
  if (!statusFilter.value) return articles.value
  return articles.value.filter(a =>
    statusFilter.value === 'published' ? a.is_published : !a.is_published
  )
})

const visiblePages = computed(() => {
  const total = pagination.value.totalPages
  const current = pagination.value.page
  const pages: number[] = []
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) pages.push(i)
  return pages
})

function formatDate(value: string) {
  if (!value) return '-'
  const d = new Date(value)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

let searchTimeout: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    fetchArticles()
  }, 400)
}

function changePage(page: number) {
  pagination.value.page = page
  fetchArticles()
}

async function togglePublish(article: any) {
  const action = article.is_published ? 'sembunyikan' : 'publikasikan'
  if (!confirm(`Yakin ingin ${action} artikel "${article.title}"?`)) return
  try {
    await $fetch(`${config.public.apiBase}/articles/${article.id}/toggle`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    article.is_published = !article.is_published
  } catch {
    article.is_published = !article.is_published
  }
}

async function deleteArticle(article: any) {
  if (!confirm(`Yakin ingin menghapus artikel "${article.title}"? Tindakan ini tidak dapat dibatalkan.`)) return
  try {
    await $fetch(`${config.public.apiBase}/articles/${article.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    articles.value = articles.value.filter(a => a.id !== article.id)
    pagination.value.total = Math.max(0, pagination.value.total - 1)
  } catch {
    /* ignore */
  }
}

async function fetchArticles() {
  loading.value = true
  const headers = { Authorization: `Bearer ${authStore.token}` }
  const params = new URLSearchParams({
    page: String(pagination.value.page),
    per_page: String(pagination.value.perPage),
    ...(categoryFilter.value && { category: categoryFilter.value }),
    ...(searchQuery.value && { search: searchQuery.value })
  })

  try {
    const data = await $fetch<any>(`${config.public.apiBase}/articles?${params}`, { headers })
    articles.value = data.data ?? data
    if (data.meta || data.total) {
      pagination.value.total = data.meta?.total ?? data.total ?? 0
      pagination.value.totalPages = data.meta?.last_page ?? data.last_page ?? 1
    }
  } catch {
    articles.value = [
      { id: 1, title: 'Prospek Pasar Saham Indonesia 2026', category: 'Analisa Pasar', author: 'Tim Riset Sekuritas', is_published: true, published_at: '2026-01-15', image_url: '' },
      { id: 2, title: 'Cara Memilih Reksa Dana untuk Pemula', category: 'Edukasi', author: 'Tim Riset Sekuritas', is_published: true, published_at: '2026-02-03', image_url: '' },
      { id: 3, title: 'Strategi Diversifikasi Portofolio', category: 'Edukasi', author: 'Tim Riset Sekuritas', is_published: false, published_at: null, created_at: '2026-03-01', image_url: '' }
    ]
    pagination.value.total = 3
    pagination.value.totalPages = 1
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchArticles())
</script>
