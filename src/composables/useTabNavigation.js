import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabStore } from '../stores/useTabStore'

export function useTabNavigation(store = useTabStore(useRoute().params.sessionId)) {
  const router = useRouter()
  const route = useRoute()

  const currentRouteName = computed(() => store.lastRoute.name)

  function navigateTo(name) {
    router.push({ name, params: { sessionId: store.sessionId } })
  }

  function isActive(name) {
    const routeName = String(currentRouteName.value || '')
    return routeName === name || routeName.startsWith(`${name}-`)
  }

  function syncRoute() {
    if (route.params.sessionId !== store.sessionId) return
    store.setLastRoute(route)
  }

  return { currentRouteName, navigateTo, isActive, syncRoute }
}
