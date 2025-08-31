<template>
  <div class="min-h-screen flex bg-gray-50 text-gray-800">
    <!-- Sidebar (desktop) -->
    <aside class="bg-white w-72 hidden md:flex flex-col justify-between h-screen border-r shadow-sm">
      <!-- Gornji: Logo + Linkovi -->
      <div class="overflow-auto">
        <div class="py-2 flex items-center justify-center">
          <img src="/images/logo4.jpg" alt="Logo" class="w-64 h-14" />
        </div>

        <nav class="flex flex-col gap-3 px-6 py-4">
          <NuxtLink to="/" class="hover:text-blue-600 flex items-center gap-2">Početna</NuxtLink>
          <NuxtLink to="/projects" class="hover:text-blue-600 flex items-center gap-2">Projekti</NuxtLink>
          <NuxtLink to="/projectTasks" class="hover:text-blue-600 flex items-center gap-2">Zadaci</NuxtLink>
          <NuxtLink to="/users" class="hover:text-blue-600 flex items-center gap-2">Korisnici</NuxtLink>
          <NuxtLink to="/sites" class="hover:text-blue-600 flex items-center gap-2">Gradilišta</NuxtLink>
        </nav>
      </div>

      <!-- Donji Logout uvijek pri dnu -->
      <div class="px-6 py-4 border-t">
        <button @click="logout" class="w-full text-left">Odjavi se</button>
      </div>
    </aside>

    <!-- Overlay za mobilni meni -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
        @click="sidebarOpen = false"
      ></div>
    </transition>

    <!-- Sidebar (mobilni) -->
    <transition name="slide">
      <aside
        v-if="sidebarOpen"
        class="fixed z-40 top-0 left-0 w-64 h-full bg-white shadow-lg flex flex-col justify-between md:hidden"
      >
        <!-- Gornji dio sa X dugmetom -->
        <div class="flex justify-between items-center px-6 py-4 border-b">
          <h1 class="text-xl font-bold"> Konstrukt</h1>
          <button @click="sidebarOpen = false">
            <svg class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Linkovi -->
        <nav class="flex flex-col gap-3 px-6 py-4 flex-1">
          <NuxtLink to="/" class="hover:text-blue-600 flex items-center gap-2">Početna</NuxtLink>
          <NuxtLink to="/projects" class="hover:text-blue-600 flex items-center gap-2">Projekti</NuxtLink>
          <NuxtLink to="/projectTasks" class="hover:text-blue-600 flex items-center gap-2">Zadaci</NuxtLink>
          <NuxtLink to="/users" class="hover:text-blue-600 flex items-center gap-2">Korisnici</NuxtLink>
          <NuxtLink to="/sites" class="hover:text-blue-600 flex items-center gap-2">Gradilišta</NuxtLink>
        </nav>

        <!-- Logout -->
        <div class="px-6 py-4 border-t">
          <button @click="logout" class="w-full text-left">Odjavi se</button>
        </div>
      </aside>
    </transition>

    <!-- Glavni sadržaj -->
    <div class="flex flex-col flex-1 h-screen overflow-y-auto">
      <!-- Header -->
      <header class="flex justify-between items-center p-4 md:px-4 pt-4 pb-4 border-b md:border-none bg-gray-50">
        <div class="flex items-center gap-4">
          <!-- Hamburger dugme -->
          <button class="md:hidden" @click="toggleSidebar">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <!-- User Info -->
        <div class="flex items-center gap-3 cursor-pointer" @click="navigateToProfile(auth.user.userId)">
          <!-- Avatar -->
          <img
            src="/images/default-avatar.jpg"
            alt="Profilna slika"
            class="w-10 h-10 rounded-full object-cover border"
          />

          <!-- Ime i prezime -->
          <div class="text-sm text-right">
            <span v-if="auth.user" class="font-semibold block">
              {{ auth.user.name.toUpperCase() }}
            </span>
            <p class="text-xs text-gray-500" v-if="auth.user">{{ auth.user.role }}</p>
          </div>
        </div>
      </header>

      <!-- Glavni slot -->
      <main class="flex-1 px-6 py-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNavigation } from '@/utils/navigation'

const auth = useAuthStore()
const sidebarOpen = ref(false)
const router = useRouter()
const { goToUserProfile, goToProjectsPage } = useNavigation()

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const logout = () => {
  auth.logout()
  router.push('/login')
}

const navigateToProfile = (userId) => {
  goToUserProfile(userId)
}

const navigateToProjectsPage = () => {
  goToProjectsPage()
}
</script>

<style scoped>
#sidebar {
  z-index: 20;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
}
</style>