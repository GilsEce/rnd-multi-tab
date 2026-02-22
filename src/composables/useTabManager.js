import { computed } from 'vue'
import { useTabsManagerStore } from '../stores/useTabsManagerStore'

export function useTabManager() {
  const tabsManager = useTabsManagerStore()

  const tabs = computed(() => tabsManager.tabs)
  const activeSessionId = computed(() => tabsManager.activeSessionId)
  const activeTab = computed(() => tabs.value.find((t) => t.sessionId === activeSessionId.value))
  const canClose = computed(() => tabs.value.length > 1)

  function addTab(label) {
    return tabsManager.addTab(label)
  }

  function closeTab(sessionId) {
    tabsManager.closeTab(sessionId)
  }

  function switchTab(sessionId) {
    tabsManager.switchTab(sessionId)
  }

  function renameTab(sessionId, label) {
    tabsManager.updateTabLabel(sessionId, label)
  }

  return { tabs, activeSessionId, activeTab, canClose, addTab, closeTab, switchTab, renameTab }
}
