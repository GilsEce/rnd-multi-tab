<script setup>
import { useTabData } from '../composables/useTabData'
import { useTabNavigation } from '../composables/useTabNavigation'
import { usePageMeta } from '../composables/usePageMeta'

const { isLoading, data, load } = useTabData()
const { navigateTo } = useTabNavigation()
const { pageTitle, pageIcon } = usePageMeta({ title: 'Customers', icon: '👥' })

const customers = [
  { name: 'Alice Thompson', email: 'alice@example.com', joinDate: 'Jan 15, 2024', color: 'blue' },
  { name: 'Bob Martinez', email: 'bob@example.com', joinDate: 'Feb 3, 2024', color: 'green' },
  { name: 'Carol White', email: 'carol@example.com', joinDate: 'Mar 22, 2024', color: 'purple' },
  { name: 'Daniel Kim', email: 'daniel@example.com', joinDate: 'Apr 8, 2024', color: 'orange' },
  { name: 'Eva Chen', email: 'eva@example.com', joinDate: 'May 17, 2024', color: 'rose' },
]

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function getAvatarClasses(color) {
  const colorMap = {
    blue: 'bg-blue-200 text-blue-700',
    green: 'bg-green-200 text-green-700',
    purple: 'bg-purple-200 text-purple-700',
    orange: 'bg-orange-200 text-orange-700',
    rose: 'bg-rose-200 text-rose-700',
  }
  return colorMap[color] || colorMap.blue
}
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

    <div class="space-y-3">
      <div
        v-for="customer in customers"
        :key="customer.email"
        class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
      >
        <div
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm',
            getAvatarClasses(customer.color),
          ]"
        >
          {{ getInitials(customer.name) }}
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-gray-800">{{ customer.name }}</h3>
          <p class="text-sm text-gray-500">{{ customer.email }}</p>
        </div>
        <div class="text-sm text-gray-400">Joined {{ customer.joinDate }}</div>
      </div>
    </div>
  </div>
</template>
