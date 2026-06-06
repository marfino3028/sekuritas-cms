<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Table header with optional search -->
    <div v-if="$slots.header || searchable" class="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
      <slot name="header" />
      <div v-if="searchable" class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          :value="searchValue"
          type="text"
          :placeholder="searchPlaceholder"
          class="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
          @input="$emit('update:searchValue', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="p-8">
      <div class="space-y-3">
        <div v-for="n in skeletonRows" :key="n" class="animate-pulse flex items-center space-x-4">
          <div v-for="c in columns.length" :key="c" class="h-4 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <template v-else>
    <div class="overflow-x-auto">
      <table class="w-max min-w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              :class="[col.align === 'right' ? 'text-right' : 'text-left', col.sortable ? 'cursor-pointer hover:text-gray-700 select-none' : '']"
              @click="col.sortable && handleSort(col.key)"
            >
              <div class="flex items-center space-x-1" :class="col.align === 'right' ? 'justify-end' : ''">
                <span>{{ col.label }}</span>
                <span v-if="col.sortable" class="flex flex-col ml-1">
                  <svg class="w-3 h-3" :class="sortKey === col.key && sortDir === 'asc' ? 'text-teal-600' : 'text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <svg class="w-3 h-3 -mt-1" :class="sortKey === col.key && sortDir === 'desc' ? 'text-teal-600' : 'text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="(row, index) in rows"
            :key="row.id || index"
            class="hover:bg-gray-50 transition-colors"
            :class="rowClass ? rowClass(row) : ''"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-5 py-3.5 whitespace-nowrap"
              :class="col.align === 'right' ? 'text-right' : ''"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] ?? '-' }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

      <!-- Empty state -->
      <div v-if="rows.length === 0" class="py-16 text-center text-gray-400">
        <slot name="empty">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-sm font-medium">{{ emptyText || 'Tidak ada data' }}</p>
        </slot>
      </div>

      <!-- Pagination -->
      <div v-if="rows.length > 0 && (totalPages > 1 || showPagination)" class="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-500">
          {{ paginationLabel || `Menampilkan ${Math.min((currentPage - 1) * perPage + 1, total)}–${Math.min(currentPage * perPage, total)} dari ${total}` }}
        </p>
        <div class="flex items-center space-x-1">
          <button
            :disabled="currentPage === 1"
            @click="$emit('page-change', currentPage - 1)"
            class="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="$emit('page-change', page)"
            class="w-8 h-8 rounded text-xs font-medium transition-colors"
            :class="page === currentPage ? 'text-white' : 'text-gray-600 hover:bg-gray-100'"
            :style="page === currentPage ? 'background-color: #009688;' : ''"
          >{{ page }}</button>
          <button
            :disabled="currentPage === totalPages"
            @click="$emit('page-change', currentPage + 1)"
            class="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'right' | 'center'
}

const props = defineProps<{
  columns: Column[]
  rows: any[]
  loading?: boolean
  skeletonRows?: number
  searchable?: boolean
  searchValue?: string
  searchPlaceholder?: string
  emptyText?: string
  currentPage?: number
  perPage?: number
  total?: number
  totalPages?: number
  showPagination?: boolean
  paginationLabel?: string
  rowClass?: (row: any) => string
}>()

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'page-change': [page: number]
  'sort-change': [key: string, dir: 'asc' | 'desc']
}>()

const sortKey = ref('')
const sortDir = ref<'asc' | 'desc'>('asc')

const visiblePages = computed(() => {
  const total = props.totalPages || 1
  const current = props.currentPage || 1
  const pages: number[] = []
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }
  return pages
})

function handleSort(key: string) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
  emit('sort-change', sortKey.value, sortDir.value)
}
</script>
