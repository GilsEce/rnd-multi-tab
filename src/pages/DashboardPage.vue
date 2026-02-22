<script setup>
import { useTabData } from '../composables/useTabData'
import { useTabNavigation } from '../composables/useTabNavigation'
import { usePageMeta } from '../composables/usePageMeta'

const { isLoading, data, load } = useTabData()
const { navigateTo } = useTabNavigation()
const { pageTitle, pageIcon } = usePageMeta({ title: 'Dashboard', icon: '🏠' })

const stats = [
  { label: 'Total Orders', value: '1,240', color: 'blue' },
  { label: 'Revenue', value: '$48,295', color: 'green' },
  { label: 'Active Users', value: '340', color: 'purple' },
]

const quickNavItems = [
  { name: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { name: 'orders', icon: '📦', label: 'Orders' },
  { name: 'products', icon: '🛍️', label: 'Products' },
  { name: 'customers', icon: '👥', label: 'Customers' },
  { name: 'reports', icon: '📊', label: 'Reports' },
]
</script>

<template>
  <div class="bg-white rounded-xl shadow p-6 m-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold flex items-center gap-2">
        <span>{{ pageIcon }}</span>
        <span>{{ pageTitle }}</span>
      </h1>
      <button
        @click="load()"
        :disabled="isLoading"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
      >
        Load Data
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center p-8">
      <svg
        class="animate-spin h-8 w-8 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>

    <div v-if="data" class="text-sm text-gray-500 mb-4">
      Last loaded: {{ new Date(data.fetchedAt).toLocaleString() }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        :class="[
          'p-6 rounded-lg',
          stat.color === 'blue' && 'bg-blue-50',
          stat.color === 'green' && 'bg-green-50',
          stat.color === 'purple' && 'bg-purple-50',
        ]"
      >
        <p class="text-sm text-gray-600 mb-1">{{ stat.label }}</p>
        <p
          :class="[
            'text-3xl font-bold',
            stat.color === 'blue' && 'text-blue-600',
            stat.color === 'green' && 'text-green-600',
            stat.color === 'purple' && 'text-purple-600',
          ]"
        >
          {{ stat.value }}
        </p>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-2">Welcome to your workspace</h2>
      <p class="text-gray-600">
        Manage your orders, products, customers, and reports all in one place. Use the sidebar or
        quick navigation below to get started.
      </p>
    </div>

    <div>
      <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Quick Navigation
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in quickNavItems"
          :key="item.name"
          @click="navigateTo(item.name)"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
        >
          <span>{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
