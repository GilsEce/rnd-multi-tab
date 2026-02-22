<script setup>
import { useTabData } from '../composables/useTabData'
import { useTabNavigation } from '../composables/useTabNavigation'
import { usePageMeta } from '../composables/usePageMeta'

const { isLoading, data, load } = useTabData()
const { navigateTo } = useTabNavigation()
const { pageTitle, pageIcon } = usePageMeta({ title: 'Orders', icon: '📦' })

const orders = [
  { id: 'ORD-001', customer: 'John Smith', status: 'Delivered', amount: '$125.00' },
  { id: 'ORD-002', customer: 'Sarah Johnson', status: 'Shipped', amount: '$89.50' },
  { id: 'ORD-003', customer: 'Mike Wilson', status: 'Pending', amount: '$234.00' },
  { id: 'ORD-004', customer: 'Emily Brown', status: 'Cancelled', amount: '$56.75' },
  { id: 'ORD-005', customer: 'David Lee', status: 'Shipped', amount: '$178.25' },
]

function getStatusClasses(status) {
  const statusMap = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Shipped: 'bg-blue-100 text-blue-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  }
  return statusMap[status] || 'bg-gray-100 text-gray-700'
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

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Order ID</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
            <th class="text-right py-3 px-4 font-semibold text-gray-600">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
          >
            <td class="py-3 px-4 font-mono text-sm">{{ order.id }}</td>
            <td class="py-3 px-4">{{ order.customer }}</td>
            <td class="py-3 px-4">
              <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusClasses(order.status)]">
                {{ order.status }}
              </span>
            </td>
            <td class="py-3 px-4 text-right font-medium">{{ order.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
