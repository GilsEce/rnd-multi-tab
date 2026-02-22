import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTabStore } from '../stores/useTabStore'

export function useTabData(store = useTabStore(useRoute().params.sessionId)) {
  const isLoading = computed(() => store.loading)
  const data = computed(() => store.data)

  async function load() {
    await store.fetchData()
  }

  function reset() {
    store.data = null
  }

  return { isLoading, data, load, reset }
}
