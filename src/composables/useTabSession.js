import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTabStore } from '../stores/useTabStore'

export function useTabSession() {
  const route = useRoute()
  const sessionId = computed(() => route.params.sessionId)
  const store = useTabStore(sessionId.value)
  return { sessionId, store }
}
