import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'

export function useYupStoreValidation({
  schema,
  store,
  storeField = 'formData',
}) {
  if (!schema) {
    throw new Error('useYupStoreValidation requires a yup schema')
  }

  if (!store) {
    throw new Error('useYupStoreValidation requires a store instance')
  }

  const schemaFieldNames = Object.keys(schema.fields || {})
  const currentStoreValues = computed(() => store[storeField] || {})

  const initialValues = schemaFieldNames.reduce((acc, fieldName) => {
    const value = currentStoreValues.value[fieldName]
    acc[fieldName] = value ?? ''
    return acc
  }, {})

  const form = useForm({
    validationSchema: schema,
    initialValues,
  })

  function applyStoreValues(values = {}) {
    const filteredValues = schemaFieldNames.reduce((acc, fieldName) => {
      if (
        Object.prototype.hasOwnProperty.call(values, fieldName) &&
        Object.prototype.hasOwnProperty.call(currentStoreValues.value, fieldName)
      ) {
        acc[fieldName] = values[fieldName]
      }
      return acc
    }, {})

    if (Object.keys(filteredValues).length === 0) return

    if (typeof store.setFormValues === 'function') {
      store.setFormValues(filteredValues)
      return
    }

    if (typeof store.$patch === 'function') {
      store.$patch({
        [storeField]: {
          ...currentStoreValues.value,
          ...filteredValues,
        },
      })
    }
  }

  let syncingFromStore = false

  watch(
    () => schemaFieldNames.map((fieldName) => currentStoreValues.value[fieldName]),
    (storeValues) => {
      syncingFromStore = true
      schemaFieldNames.forEach((fieldName, index) => {
        if (form.values[fieldName] !== storeValues[index]) {
          form.setFieldValue(fieldName, storeValues[index], false)
        }
      })
      queueMicrotask(() => {
        syncingFromStore = false
      })
    },
    { immediate: true },
  )

  watch(
    () => schemaFieldNames.map((fieldName) => form.values[fieldName]),
    async (nextValues, prevValues = []) => {
      if (syncingFromStore) return

      const changedFieldNames = schemaFieldNames.filter(
        (fieldName, index) => nextValues[index] !== prevValues[index],
      )

      if (changedFieldNames.length === 0) return

      const valuesForValidation = schemaFieldNames.reduce((acc, fieldName, index) => {
        acc[fieldName] = nextValues[index]
        return acc
      }, {})

      for (const fieldName of changedFieldNames) {
        try {
          await schema.validateAt(fieldName, valuesForValidation)
          applyStoreValues({ [fieldName]: valuesForValidation[fieldName] })
        } catch {
          // Invalid field values stay in form state until corrected.
        }
      }
    },
  )

  async function validateAndSave() {
    const validationResult = await form.validate()
    if (validationResult.valid) {
      applyStoreValues(validationResult.values)
    }
    return validationResult
  }

  function handleSubmitToStore(onSuccess) {
    return form.handleSubmit(async (values, submitContext) => {
      applyStoreValues(values)
      if (onSuccess) {
        await onSuccess(values, submitContext)
      }
    })
  }

  return {
    ...form,
    schemaFieldNames,
    validateAndSave,
    handleSubmitToStore,
  }
}
