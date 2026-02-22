<script setup>
import { useTabData } from '../composables/useTabData'
import { useTabNavigation } from '../composables/useTabNavigation'
import { usePageMeta } from '../composables/usePageMeta'

const { isLoading, data, load } = useTabData()
const { navigateTo } = useTabNavigation()
const { pageTitle, pageIcon } = usePageMeta({ title: 'Products', icon: '🛍️' })

const products = [
  { name: 'Wireless Headphones', price: '$79.99', stock: 'In Stock' },
  { name: 'Bluetooth Speaker', price: '$45.00', stock: 'Low Stock' },
  { name: 'USB-C Hub', price: '$34.99', stock: 'In Stock' },
  { name: 'Mechanical Keyboard', price: '$129.00', stock: 'Out of Stock' },
  { name: 'Gaming Mouse', price: '$59.99', stock: 'In Stock' },
  { name: 'Monitor Stand', price: '$89.00', stock: 'Low Stock' },
]

function getStockClasses(stock) {
  const stockMap = {
    'In Stock': 'bg-green-100 text-green-700',
    'Low Stock': 'bg-yellow-100 text-yellow-700',
    'Out of Stock': 'bg-red-100 text-red-700',
  }
  return stockMap[stock] || 'bg-gray-100 text-gray-700'
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

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="product in products"
        :key="product.name"
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
      >
        <div class="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
          <span class="text-4xl">📦</span>
        </div>
        <h3 class="font-semibold text-gray-800 mb-1">{{ product.name }}</h3>
        <p class="text-lg font-bold text-blue-600 mb-2">{{ product.price }}</p>
        <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStockClasses(product.stock)]">
          {{ product.stock }}
        </span>
      </div>
    </div>
  </div>
</template>
