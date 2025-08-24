<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
    <div class="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl relative animate-fade-in">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Dodaj korisnika</h2>

      <form @submit.prevent="submit" class="space-y-4">
        <!-- Ime i Prezime -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ime</label>
            <input v-model="form.firstName" type="text" class="input w-full" />
            <p v-if="errors.firstName" class="text-red-500 text-xs mt-1">{{ errors.firstName }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prezime</label>
            <input v-model="form.lastName" type="text" class="input w-full" />
            <p v-if="errors.lastName" class="text-red-500 text-xs mt-1">{{ errors.lastName }}</p>
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" class="input w-full" />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password i Confirm -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lozinka</label>
            <input v-model="form.password" type="password" class="input w-full" />
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Potvrdi lozinku</label>
            <input v-model="form.confirmPassword" type="password" class="input w-full" />
            <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</p>
          </div>
        </div>

        <!-- Rola -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Rola</label>
          <select v-model="form.role" class="input w-full">
            <option value="" disabled selected>Odaberi rolu</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          <p v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</p>
        </div>

        <!-- Dugmad -->
        <div class="flex justify-end gap-3 pt-4 mt-6">
          <button type="button" @click="$emit('close')" class="btn-secondary py-2 px-4 rounded-full">Otkaži</button>
          <button type="submit" class="btn-primary py-2 px-4 rounded-full">Sačuvaj</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'user-added'])

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
})

const errors = ref({})

const validate = () => {
  errors.value = {}

  if (!form.value.firstName.trim()) errors.value.firstName = 'Ime je obavezno.'
  if (!form.value.lastName.trim()) errors.value.lastName = 'Prezime je obavezno.'
  if (!form.value.email.trim()) errors.value.email = 'Email je obavezan.'
  else if (!/\S+@\S+\.\S+/.test(form.value.email)) errors.value.email = 'Email nije validan.'

  if (!form.value.password) errors.value.password = 'Lozinka je obavezna.'
  else if (form.value.password.length < 6) errors.value.password = 'Lozinka mora imati najmanje 6 karaktera.'

  if (!form.value.confirmPassword) errors.value.confirmPassword = 'Potvrda lozinke je obavezna.'
  else if (form.value.password !== form.value.confirmPassword)
    errors.value.confirmPassword = 'Lozinke se ne poklapaju.'

  if (!form.value.role) errors.value.role = 'Rola je obavezna.'

  return Object.keys(errors.value).length === 0
}

const submit = async () => {
  if (!validate()) return

  try {
    await createUser(form.value)
    emit('user-added')
    emit('close')
  } catch (err) {
    console.error('Greška prilikom kreiranja korisnika:', err)
  }
}
</script>

<style scoped>
.input {
  @apply px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 font-semibold;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold;
}
</style>