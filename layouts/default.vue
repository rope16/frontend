<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <!-- Navbar -->
    <header class="bg-blue-400 text-white px-4 py-3 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <!-- Hamburger for mobile -->
        <button class="md:hidden" @click="toggleSidebar">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="text-xl font-bold">Gradilišta</h1>
      </div>
      <div class="flex items-center gap-4 text-sm">
        <span v-if="auth.user">👤 {{ auth.user.name }}</span>
      </div>
    </header>

    <!-- Sidebar + Page -->
    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside
        class="bg-white md:bg-gray-100 w-64 p-4 shadow-md transition-transform duration-300 z-20
                md:relative md:translate-x-0 md:shadow-none
                fixed h-screen md:h-auto top-0 left-0
                transform flex flex-col justify-between"
        :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }"
        id="sidebar"
        >
        <!-- Navigacija -->
        <nav class="flex flex-col gap-3">
            <NuxtLink to="/" class="hover:text-blue-600 h-8">🏠 Početna</NuxtLink>
            <NuxtLink to="/projekti" class="hover:text-blue-600 h-8">📁 Projekti</NuxtLink>
            <NuxtLink to="/zadaci" class="hover:text-blue-600 h-8">📝 Zadaci</NuxtLink>
            <NuxtLink to="/korisnici" class="hover:text-blue-600 h-8">👥 Korisnici</NuxtLink>
        </nav>

        <!-- Logout dugme -->
        <div class="border-t">
            <button
            @click="logout"
            class="w-full text-left text-red-600 hover:text-red-800 px-4 pt-4 h-8"
            >
            🚪 Odjavi se
            </button>
        </div>
      </aside>

      <!-- Overlay for mobile -->
      <div
        class="fixed inset-0 bg-black bg-opacity-40 md:hidden z-10"
        v-if="sidebarOpen"
        @click="sidebarOpen = false"
      ></div>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const sidebarOpen = ref(false)
const router = useRouter()

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Prevent transition from flashing sidebar on page load */
#sidebar {
  z-index: 20;
}
</style>