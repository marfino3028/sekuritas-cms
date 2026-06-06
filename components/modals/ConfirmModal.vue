<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="!loading && $emit('cancel')"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" @click="!loading && $emit('cancel')"></div>

      <!-- Modal -->
      <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="px-6 pt-6 pb-4">
          <div class="flex items-start space-x-4">
            <!-- Icon -->
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              :class="iconBgClass"
            >
              <svg v-if="confirmVariant === 'danger'" class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <svg v-else-if="confirmVariant === 'success'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ message }}</p>
              <slot />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 flex items-center justify-end space-x-3">
          <button
            type="button"
            :disabled="loading"
            @click="$emit('cancel')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {{ cancelLabel || 'Batal' }}
          </button>
          <button
            type="button"
            :disabled="loading"
            @click="$emit('confirm')"
            class="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-60 flex items-center space-x-2 min-w-28 justify-center"
            :class="confirmBtnClass"
          >
            <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span>{{ loading ? 'Memproses...' : (confirmLabel || 'Konfirmasi') }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'danger' | 'success' | 'primary'
  loading?: boolean
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()

const iconBgClass = computed(() => {
  switch (props.confirmVariant) {
    case 'danger': return 'bg-red-100'
    case 'success': return 'bg-green-100'
    default: return 'bg-blue-100'
  }
})

const confirmBtnClass = computed(() => {
  switch (props.confirmVariant) {
    case 'danger': return 'bg-red-500 hover:bg-red-600'
    case 'success': return 'bg-teal-600 hover:bg-teal-700'
    default: return 'bg-blue-600 hover:bg-blue-700'
  }
})
</script>
