<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTabNavigation } from '../composables/useTabNavigation'
import { useTabSession } from '../composables/useTabSession'

const route = useRoute()
const { navigateTo, isActive, syncRoute } = useTabNavigation()
const { sessionId } = useTabSession()

watch(
  () => route.fullPath,
  () => {
    syncRoute()
  },
  { immediate: true },
)

const navItems = [
  { name: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { name: 'orders', icon: '📦', label: 'Orders' },
  { name: 'products', icon: '🛍️', label: 'Products' },
  { name: 'customers', icon: '👥', label: 'Customers' },
  { name: 'reports', icon: '📊', label: 'Reports' },
]
</script>

<template>
  <div class="flex">
    <aside class="bg-white w-56 min-h-screen shadow-md flex flex-col fixed left-0 top-10 bottom-0">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-gray-800">WorkTabs</h1>
      </div>

      <nav class="flex-1 p-3 space-y-1">
        <button
          v-for="item in navItems"
          :key="item.name"
          @click="navigateTo(item.name)"
          :class="[
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200',
            isActive(item.name)
              ? 'bg-gray-100 text-blue-600 font-semibold'
              : 'text-gray-700 hover:bg-gray-50',
          ]"
        >
          <span>{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="p-3 border-t">
        <p class="text-xs text-gray-400 truncate" :title="sessionId">
          Session: {{ sessionId?.slice(0, 8) }}...
        </p>
      </div>
    </aside>

    <main class="ml-56 mt-10 min-h-screen flex-1">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" :key="route.name" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>
