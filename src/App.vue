<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TabBar from './components/TabBar.vue'
import { useTabManager } from './composables/useTabManager'

const route = useRoute()
const router = useRouter()
const { tabs, activeSessionId, addTab, switchTab } = useTabManager()

onMounted(() => {
  if (tabs.value.length > 0) {
    if (activeSessionId.value) {
      switchTab(activeSessionId.value)
    }
  } else {
    const defaultTabs = [
      { label: 'Workspace', startPage: 'dashboard' },
      { label: 'Sales', startPage: 'orders' },
      { label: 'Inventory', startPage: 'products' },
      { label: 'Analytics', startPage: 'reports' },
    ]

    const sessionIds = defaultTabs.map((t) => {
      const sessionId = addTab(t.label)
      return { sessionId, startPage: t.startPage }
    })

    router.push({
      name: sessionIds[0].startPage,
      params: { sessionId: sessionIds[0].sessionId },
    })
  }
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen">
    <TabBar />
    <RouterView :key="route.params.sessionId" />
  </div>
</template>
