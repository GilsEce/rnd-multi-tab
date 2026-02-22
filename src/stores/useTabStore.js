import { ref } from 'vue'
import { defineStore, getActivePinia } from 'pinia'

export function useTabStore(sessionId) {
  return defineStore(`tab-${sessionId}`, () => {
    const _sessionId = ref(sessionId)
    const loading = ref(false)
    const data = ref(null)
    const lastRoute = ref({ name: 'dashboard', params: { sessionId } })

    function setLastRoute(route) {
      lastRoute.value = {
        name: route.name,
        params: { ...route.params },
        query: { ...route.query },
      }
    }

    function fetchData() {
      loading.value = true
      return new Promise((resolve) => {
        setTimeout(() => {
          data.value = { fetchedAt: new Date().toISOString() }
          loading.value = false
          resolve()
        }, 1500)
      })
    }

    function cleanup() {
      const persistKey = `tab-${sessionId}`
      const pinia = getActivePinia()
      if (pinia) {
        const store = pinia._s.get(persistKey)
        if (store) store.$dispose()
        pinia._s.delete(persistKey)
      }
      localStorage.removeItem(persistKey)
    }

    return {
      sessionId: _sessionId,
      loading,
      data,
      lastRoute,
      setLastRoute,
      fetchData,
      cleanup,
    }
  }, {
    persist: {
      key: `tab-${sessionId}`,
      storage: localStorage,
      paths: ['lastRoute', 'data'],
    },
  })()
}
