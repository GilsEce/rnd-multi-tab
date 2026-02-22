import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTabStore } from '../stores/useTabStore'
import { useTabsManagerStore } from '../stores/useTabsManagerStore'

export function usePageMeta(
  meta = { title: '', icon: '' },
  store = useTabStore(useRoute().params.sessionId),
) {
  const pageTitle = ref(meta.title)
  const pageIcon = ref(meta.icon)

  function syncToTab() {
    const tabsManager = useTabsManagerStore()
    tabsManager.updateTabLabel(store.sessionId, `${meta.icon} ${meta.title}`)
  }

  return { pageTitle, pageIcon, syncToTab }
}
