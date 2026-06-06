<template>
  <span
    class="inline-flex items-center space-x-1 font-medium rounded-full"
    :class="[sizeClass, badgeClass]"
  >
    <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="dotClass"></span>
    <span>{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string
  size?: 'xs' | 'sm' | 'md'
}>()

type BadgeConfig = {
  badge: string
  dot: string
  label: string
}

const statusConfig: Record<string, BadgeConfig> = {
  // KYC statuses
  pending: { badge: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500', label: 'Pending' },
  approved: { badge: 'bg-green-100 text-green-800', dot: 'bg-green-500', label: 'Approved' },
  rejected: { badge: 'bg-red-100 text-red-800', dot: 'bg-red-500', label: 'Rejected' },
  none: { badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', label: 'Belum KYC' },

  // Transaction statuses
  completed: { badge: 'bg-green-100 text-green-800', dot: 'bg-green-500', label: 'Completed' },
  failed: { badge: 'bg-red-100 text-red-800', dot: 'bg-red-500', label: 'Failed' },
  cancelled: { badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', label: 'Cancelled' },
  processing: { badge: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500', label: 'Processing' },

  // Product statuses
  active: { badge: 'bg-green-100 text-green-800', dot: 'bg-green-500', label: 'Aktif' },
  inactive: { badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', label: 'Nonaktif' },

  // User statuses
  verified: { badge: 'bg-teal-100 text-teal-800', dot: 'bg-teal-500', label: 'Verified' },
  suspended: { badge: 'bg-red-100 text-red-800', dot: 'bg-red-500', label: 'Suspended' },

  // Generic
  success: { badge: 'bg-green-100 text-green-800', dot: 'bg-green-500', label: 'Success' },
  error: { badge: 'bg-red-100 text-red-800', dot: 'bg-red-500', label: 'Error' },
  warning: { badge: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500', label: 'Warning' },
  info: { badge: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500', label: 'Info' }
}

const config = computed<BadgeConfig>(() => {
  return statusConfig[props.status?.toLowerCase()] || {
    badge: 'bg-gray-100 text-gray-600',
    dot: 'bg-gray-400',
    label: props.status || 'Unknown'
  }
})

const badgeClass = computed(() => config.value.badge)
const dotClass = computed(() => config.value.dot)
const label = computed(() => config.value.label)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs': return 'px-1.5 py-0.5 text-xs'
    case 'sm': return 'px-2 py-0.5 text-xs'
    default: return 'px-2.5 py-1 text-xs'
  }
})
</script>
