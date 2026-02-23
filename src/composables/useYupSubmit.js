import { ref } from 'vue'

export function useYupSubmit({ schema, data, onSuccess }) {
  if (!schema) throw new Error('useYupSubmit requires a yup schema')
  if (!data) throw new Error('useYupSubmit requires a data source')

  const errors = ref({})
  const isSubmitting = ref(false)

  async function handleSubmit(event) {
    if (event?.preventDefault) event.preventDefault()
    isSubmitting.value = true
    errors.value = {}
    try {
      const values = typeof data === 'function' ? data() : data
      await schema.validate(values, { abortEarly: false })
      if (onSuccess) await onSuccess(values)
    } catch (validationError) {
      if (validationError.inner) {
        validationError.inner.forEach((err) => {
          errors.value[err.path] = err.message
        })
      }
    } finally {
      isSubmitting.value = false
    }
  }

  return { errors, isSubmitting, handleSubmit }
}
