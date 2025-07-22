<template>
   <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">📊 Statistika sistema</h1>

    <div v-if="homeStore.loading">Učitavanje...</div>
    <div v-if="homeStore.error" class="text-red-600">{{ homeStore.error }}</div>

    <div
      v-if="homeStore.statistics"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
    >
      <div
        class="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
      >
        <div class="flex items-center justify-start- gap-2">
          <div class="text-blue-600 text-3xl mb-2">📁</div>
          <h2 class="text-lg font-semibold text-gray-700">Projekti</h2>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ homeStore.statistics.projectCount }}</p>
      </div>

      <div
        class="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
      >
        <div class="flex items-center justify-start- gap-2">
          <div class="text-indigo-600 text-3xl mb-2">🏗️</div>
          <h2 class="text-lg font-semibold text-gray-700">Gradilišta</h2>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ homeStore.statistics.constructionSitesCount }}</p>
      </div>

      <div
        class="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
      >
        <div class="flex items-center justify-start- gap-2">
          <div class="text-green-600 text-3xl mb-2">👥</div>
           <h2 class="text-lg font-semibold text-gray-700">Korisnici</h2>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ homeStore.statistics.usersCount }}</p>
      </div>

      <div
        class="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
      >
        <div class="flex items-center justify-start- gap-2">
          <div class="text-yellow-600 text-3xl mb-2">⚙️</div>
          <h2 class="text-lg font-semibold text-gray-700">Aktivni zadaci</h2>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ homeStore.statistics.activeTasksCount }}</p>
      </div>

      <div
        class="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
      >
        <div class="flex items-center justify-start- gap-2">
          <div class="text-purple-600 text-3xl mb-2">✅</div>
          <h2 class="text-lg font-semibold text-gray-700">Završeni zadaci</h2>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ homeStore.statistics.completedTasksCount }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHomeStore } from '@/stores/home'

const homeStore = useHomeStore()

onMounted(() => {
  if (!homeStore.statistics) {
    homeStore.loadStatistics()
  }
})
</script>