import { ref } from 'vue'
import { defineStore, getActivePinia } from 'pinia'

function getDefaultFormData() {
  return {
    name: '',
    lastname: '',
    age: '',
    address: '',
    gender: '',
    profession: '',
  }
}

export function useApplicationStore(sessionId) {
  return defineStore(`application-${sessionId}`, () => {
    const _sessionId = ref(sessionId)
    const formData = ref(getDefaultFormData())
    const submittedAt = ref(null)

    function setFormField(fieldName, value) {
      if (!(fieldName in formData.value)) return
      formData.value[fieldName] = value
    }

    function setFormValues(values = {}) {
      Object.entries(values).forEach(([fieldName, value]) => {
        setFormField(fieldName, value)
      })
    }

    function markSubmitted() {
      submittedAt.value = new Date().toISOString()
    }

    function resetForm() {
      formData.value = getDefaultFormData()
      submittedAt.value = null
    }

    function cleanup() {
      const persistKey = `application-${sessionId}`
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
      formData,
      submittedAt,
      setFormField,
      setFormValues,
      markSubmitted,
      resetForm,
      cleanup,
    }
  }, {
    persist: {
      key: `application-${sessionId}`,
      storage: localStorage,
      paths: ['formData', 'submittedAt'],
    },
  })()
}
