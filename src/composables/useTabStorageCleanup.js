import { onMounted, onUnmounted } from 'vue'

const TABS_MANAGER_KEY = 'tabs-manager'
const SESSION_ID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i

export function useTabStorageCleanup(intervalMs = 10000) {
  let cleanupIntervalId = null

  function getActiveSessionIds() {
    const raw = localStorage.getItem(TABS_MANAGER_KEY)
    if (!raw) return new Set()

    try {
      const parsed = JSON.parse(raw)
      const tabs = Array.isArray(parsed?.tabs) ? parsed.tabs : []
      const sessionIds = tabs
        .map((tab) => tab?.sessionId)
        .filter((sessionId) => typeof sessionId === 'string' && sessionId.length > 0)

      return new Set(sessionIds)
    } catch {
      // Ignore malformed persisted payloads and avoid deleting valid data blindly.
      return new Set()
    }
  }

  function cleanupStaleTabStorage() {
    const activeSessionIds = getActiveSessionIds()

    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index)
      if (!key || key === TABS_MANAGER_KEY) continue

      const sessionIdMatch = key.match(SESSION_ID_PATTERN)
      if (!sessionIdMatch) continue

      const sessionId = sessionIdMatch[0]
      if (!activeSessionIds.has(sessionId)) {
        localStorage.removeItem(key)
      }
    }
  }

  onMounted(() => {
    cleanupStaleTabStorage()
    cleanupIntervalId = window.setInterval(cleanupStaleTabStorage, intervalMs)
  })

  onUnmounted(() => {
    if (cleanupIntervalId !== null) {
      window.clearInterval(cleanupIntervalId)
      cleanupIntervalId = null
    }
  })

  return { cleanupStaleTabStorage }
}
