<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
  >
    <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
      <h3 class="text-lg font-bold mb-4">Uredi profil</h3>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Ime</label>
          <input v-model="localProfile.firstName" @input="validateField('firstName')" class="input" />
          <p v-if="errors.firstName" class="text-sm text-red-500 mt-1">{{ errors.firstName }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Prezime</label>
          <input v-model="localProfile.lastName" @input="validateField('lastName')" class="input" />
          <p v-if="errors.lastName" class="text-sm text-red-500 mt-1">{{ errors.lastName }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="localProfile.email" @input="validateField('email')" class="input" />
          <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button @click="$emit('close')" class="btn-secondary rounded-full">Otkaži</button>
        <button
          @click="save"
          class="btn-primary rounded-full"
          :disabled="!isFormValid"
        >
          Sačuvaj
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useProfileStore } from '@/stores/profile'

const props = defineProps({
  visible: Boolean,
  profile: Object
})
const emit = defineEmits(['close'])

const profileStore = useProfileStore()
const localProfile = ref({ firstName: '', lastName: '', email: '' })

const errors = ref({
  firstName: '',
  lastName: '',
  email: ''
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateField = (field) => {
  const value = localProfile.value[field]

  switch (field) {
    case 'firstName':
      errors.value.firstName =
        !value || value.length > 20
          ? 'Ime je obavezno i mora imati najviše 20 karaktera.'
          : ''
      break
    case 'lastName':
      errors.value.lastName =
        !value || value.length > 20
          ? 'Prezime je obavezno i mora imati najviše 20 karaktera.'
          : ''
      break
    case 'email':
      errors.value.email =
        !value || !emailRegex.test(value) || value.length > 50
          ? 'Unesite ispravnu email adresu (maks. 50 karaktera).'
          : ''
      break
  }
}

const validateAll = () => {
  validateField('firstName')
  validateField('lastName')
  validateField('email')
}

watch(
  () => props.profile,
  (newVal) => {
    if (newVal) {
      localProfile.value = { ...newVal }
      validateAll()
    }
  },
  { immediate: true }
)

const isFormValid = computed(() => {
  return (
    !errors.value.firstName &&
    !errors.value.lastName &&
    !errors.value.email &&
    localProfile.value.firstName &&
    localProfile.value.lastName &&
    localProfile.value.email
  )
})

const save = async () => {
  validateAll()
  if (!isFormValid.value) return

  await profileStore.updateUserProfile(props.profile.userId, localProfile.value)
  emit('close')
}
</script>

<style scoped>
.input {
  @apply mt-1 block w-full px-4 py-2 text-sm bg-white border border-gray-300 
    rounded-md shadow-sm placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
  transition: border 0.2s, box-shadow 0.2s;
}
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-secondary {
  @apply bg-gray-300 hover:bg-gray-400 text-black px-4 py-2;
}
</style>