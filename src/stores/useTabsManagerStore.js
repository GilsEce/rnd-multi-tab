import { ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { useTabStore } from './useTabStore'
import { useApplicationStore } from './useApplicationStore'
import router from '../router'

const TAB_COLORS = ['blue', 'green', 'purple', 'orange', 'rose', 'cyan', 'amber', 'teal']

export const useTabsManagerStore = defineStore('tabs-manager', () => {
  const tabs = ref([])
  const activeSessionId = ref(null)

  function addTab(label) {
    const sessionId = uuidv4()
    const color = TAB_COLORS[tabs.value.length % TAB_COLORS.length]
    tabs.value.push({
      sessionId,
      label: label || `Tab ${tabs.value.length + 1}`,
      color,
    })
    switchTab(sessionId)
    return sessionId
  }

  function switchTab(sessionId) {
    activeSessionId.value = sessionId
    const store = useTabStore(sessionId)
    router.push(store.lastRoute)
  }

  function closeTab(sessionId) {
    const index = tabs.value.findIndex((t) => t.sessionId === sessionId)
    if (index === -1) return

    const store = useTabStore(sessionId)
    store.cleanup()
    const applicationStore = useApplicationStore(sessionId)
    applicationStore.cleanup()

    tabs.value.splice(index, 1)

    if (activeSessionId.value === sessionId && tabs.value.length > 0) {
      const nextIndex = Math.min(index, tabs.value.length - 1)
      switchTab(tabs.value[nextIndex].sessionId)
      return
    }

    if (tabs.value.length === 0) {
      activeSessionId.value = null
    }
  }

  function updateTabLabel(sessionId, label) {
    const tab = tabs.value.find((t) => t.sessionId === sessionId)
    if (tab) {
      tab.label = label
    }
  }

  return {
    tabs,
    activeSessionId,
    addTab,
    switchTab,
    closeTab,
    updateTabLabel,
  }
}, {
  persist: {
    key: 'tabs-manager',
    storage: localStorage,
    paths: ['tabs', 'activeSessionId'],
  },
})
