<script setup>
import * as yup from 'yup'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTabNavigation } from '../composables/useTabNavigation'
import { usePageMeta } from '../composables/usePageMeta'
import { useYupStoreValidation } from '../composables/useYupStoreValidation'
import { useApplicationStore } from '../stores/useApplicationStore'

const route = useRoute()
const { navigateTo } = useTabNavigation()
const { pageTitle, pageIcon } = usePageMeta({ title: 'Application Form', icon: '📝' })
const applicationStore = useApplicationStore(route.params.sessionId)

const validationSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  lastname: yup.string().trim().required('Lastname is required'),
  age: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError('Age must be a number')
    .required('Age is required')
    .min(18, 'Age must be at least 18')
    .max(120, 'Age must be 120 or less'),
  address: yup.string().trim().required('Address is required'),
  gender: yup
    .string()
    .oneOf(['Male', 'Female', 'Other'], 'Gender is required')
    .required('Gender is required'),
  profession: yup.string().trim().required('Profession is required'),
})

const {
  errors,
  defineField,
  handleSubmitToStore,
  isSubmitting,
} = useYupStoreValidation({
  schema: validationSchema,
  store: applicationStore,
})

const [name, nameAttrs] = defineField('name')
const [lastname, lastnameAttrs] = defineField('lastname')
const [age, ageAttrs] = defineField('age')
const [address, addressAttrs] = defineField('address')
const [gender, genderAttrs] = defineField('gender')
const [profession, professionAttrs] = defineField('profession')

const submitted = computed(() => Boolean(applicationStore.submittedAt))

const submitForm = handleSubmitToStore(() => {
  applicationStore.markSubmitted()
})
</script>

<template>
  <div class="bg-white rounded-xl shadow p-6 m-4 max-w-3xl">

    <form @submit="submitForm" class="space-y-4" novalidate>
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          id="name"
          v-model="name"
          v-bind="nameAttrs"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
      </div>

      <div>
        <label for="lastname" class="block text-sm font-medium text-gray-700 mb-1">Lastname</label>
        <input
          id="lastname"
          v-model="lastname"
          v-bind="lastnameAttrs"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.lastname" class="mt-1 text-sm text-red-600">{{ errors.lastname }}</p>
      </div>

      <div>
        <label for="age" class="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <input
          id="age"
          v-model="age"
          v-bind="ageAttrs"
          type="number"
          min="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.age" class="mt-1 text-sm text-red-600">{{ errors.age }}</p>
      </div>

      <div>
        <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea
          id="address"
          v-model="address"
          v-bind="addressAttrs"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
      </div>

      <div>
        <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select
          id="gender"
          v-model="gender"
          v-bind="genderAttrs"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option disabled value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <p v-if="errors.gender" class="mt-1 text-sm text-red-600">{{ errors.gender }}</p>
      </div>

      <div>
        <label for="profession" class="block text-sm font-medium text-gray-700 mb-1">Profession</label>
        <input
          id="profession"
          v-model="profession"
          v-bind="professionAttrs"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.profession" class="mt-1 text-sm text-red-600">{{ errors.profession }}</p>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-60"
      >
        {{ isSubmitting ? 'Submitting...' : 'Submit' }}
      </button>
    </form>

    <div v-if="submitted" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
      Application submitted successfully.
    </div>
  </div>
</template>
