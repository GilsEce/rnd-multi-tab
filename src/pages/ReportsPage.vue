<script setup>
import { onActivated, onDeactivated, ref } from 'vue'
import { useTabData } from '../composables/useTabData'
import { useTabNavigation } from '../composables/useTabNavigation'
import { usePageMeta } from '../composables/usePageMeta'

const { isLoading, data, load } = useTabData()
const { navigateTo } = useTabNavigation()
const { pageTitle, pageIcon } = usePageMeta({ title: 'Reports', icon: '📊' })


onActivated(() => {
  console.log('reports tab active')
})

onDeactivated(() => {
  console.log('reports tab inactive')
})

const reports = ref([
  {
    id: 'monthly',
    title: 'Monthly Sales',
    description: 'Detailed breakdown of sales for the current month',
    generating: false,
    result: null,
  },
  {
    id: 'quarterly',
    title: 'Quarterly Growth',
    description: 'Quarter-over-quarter growth analysis',
    generating: false,
    result: null,
  },
  {
    id: 'annual',
    title: 'Annual Summary',
    description: 'Comprehensive yearly performance overview',
    generating: false,
    result: null,
  },
])

function generateReport(report) {
  report.generating = true
  report.result = null
  setTimeout(() => {
    report.generating = false
    const results = {
      monthly: 'Total Sales: $124,500 | Orders: 847 | Avg Order: $147',
      quarterly: 'Growth: +15.3% | New Customers: 234 | Retention: 89%',
      annual: 'Revenue: $1.2M | Profit: $340K | YoY Growth: +22%',
    }
    report.result = results[report.id]
  }, 2000)
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

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="report in reports"
        :key="report.id"
        class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-semibold text-gray-800 mb-1">{{ report.title }}</h3>
            <p class="text-sm text-gray-500">{{ report.description }}</p>
          </div>
          <span class="text-2xl">📈</span>
        </div>

        <button
          @click="generateReport(report)"
          :disabled="report.generating"
          class="w-full mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg
            v-if="report.generating"
            class="animate-spin h-4 w-4 text-gray-600"
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
          <span>{{ report.generating ? 'Generating...' : 'Generate Report' }}</span>
        </button>

        <div
          v-if="report.result"
          class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800"
        >
          {{ report.result }}
        </div>
      </div>
    </div>
  </div>
</template>
