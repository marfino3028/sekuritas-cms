<template>
  <div class="bg-white rounded-2xl border border-gray-100 p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
    <!-- Colored top accent bar -->
    <div class="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" :style="{ background: accentGradient }"></div>

    <!-- Decorative background orb -->
    <div
      class="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-8"
      :style="{ background: bgOrb }"
    ></div>

    <div class="relative">
      <!-- Icon -->
      <div
        class="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        :style="{ background: iconBg }"
      >
        <div :style="{ color: iconColor }">
          <slot name="icon" />
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="animate-pulse space-y-2">
        <div class="h-8 bg-gray-100 rounded-lg w-28"></div>
        <div class="h-3 bg-gray-100 rounded w-20"></div>
        <div class="h-3 bg-gray-100 rounded w-24"></div>
      </div>

      <!-- Content -->
      <div v-else>
        <p class="text-2xl font-bold text-gray-900 leading-tight tracking-tight">{{ value }}</p>
        <p class="text-xs font-medium text-gray-500 mt-1.5 uppercase tracking-wide">{{ title }}</p>
        <div v-if="trend" class="flex items-center gap-1 mt-2.5">
          <div
            class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
            :style="trendUp
              ? 'background: #d1fae5; color: #059669'
              : 'background: #fef3c7; color: #d97706'"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                :d="trendUp ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17H5m0 0V9m0 8l8-8 4 4 6-6'" />
            </svg>
            {{ trend }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  value: string | number
  loading?: boolean
  color?: 'blue' | 'teal' | 'yellow' | 'purple' | 'red' | 'green'
  trend?: string
  trendUp?: boolean
}>()

const colorConfig = {
  blue: {
    gradient: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    orb: 'radial-gradient(circle, #93c5fd, transparent)',
  },
  teal: {
    gradient: 'linear-gradient(90deg, #14b8a6, #0ea5e9)',
    iconBg: '#f0fdf4',
    iconColor: '#0d9488',
    orb: 'radial-gradient(circle, #99f6e4, transparent)',
  },
  yellow: {
    gradient: 'linear-gradient(90deg, #f59e0b, #fcd34d)',
    iconBg: '#fffbeb',
    iconColor: '#d97706',
    orb: 'radial-gradient(circle, #fde68a, transparent)',
  },
  purple: {
    gradient: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
    iconBg: '#f5f3ff',
    iconColor: '#7c3aed',
    orb: 'radial-gradient(circle, #c4b5fd, transparent)',
  },
  red: {
    gradient: 'linear-gradient(90deg, #ef4444, #f87171)',
    iconBg: '#fff1f2',
    iconColor: '#dc2626',
    orb: 'radial-gradient(circle, #fca5a5, transparent)',
  },
  green: {
    gradient: 'linear-gradient(90deg, #10b981, #34d399)',
    iconBg: '#f0fdf4',
    iconColor: '#059669',
    orb: 'radial-gradient(circle, #6ee7b7, transparent)',
  },
}

const config = computed(() => colorConfig[props.color || 'teal'])
const accentGradient = computed(() => config.value.gradient)
const iconBg = computed(() => config.value.iconBg)
const iconColor = computed(() => config.value.iconColor)
const bgOrb = computed(() => config.value.orb)
</script>
