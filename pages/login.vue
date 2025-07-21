<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <form class="bg-white p-8 rounded shadow-md w-full max-w-sm" @submit.prevent="handleLogin">

      <h2 class="text-2xl font-bold mb-6">Prijava</h2>

        <div v-if="auth.error" class="text-red-600 mb-4 text-sm">
          {{ "Došlo je do greške. Molimo Vas provjerite email i šifru." }}
        </div>

      <input v-model="email" type="text" placeholder="Korisničko ime"
             class="w-full mb-4 p-2 border rounded" />
      <input v-model="password" type="password" placeholder="Lozinka"
             class="w-full mb-4 p-2 border rounded" />
      <button type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
        Prijavi se
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

definePageMeta({
  ssr: false,
  layout: false, // Ne koristi layout za ovu stranicu
})

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
    await auth.login({ email: email.value, password: password.value })

    if (auth.isAuthenticated) {
        router.push('/')
    }
}
</script>