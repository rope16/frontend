<template>
   <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">📊 Statistika sistema</h1>

    <div
      v-if="homeStore.statistics"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
    >
      <StatCard
        icon="📁"
        title="Projekti"
        :value="homeStore.statistics.projectCount"
      />
      
      <StatCard
        icon="🏗️"
        title="Gradilišta"
        :value="homeStore.statistics.constructionSitesCount"
      />

      <StatCard
        icon="👥"
        title="Korisnici"
        :value="homeStore.statistics.usersCount"
      />

      <StatCard
        icon="⚙️"
        title="Aktivni zadaci"
        :value="homeStore.statistics.activeTasksCount"
      />

      <StatCard
        icon="✅"
        title="Završeni zadaci"
        :value="homeStore.statistics.completedTasksCount"
      />
    </div>

    <div class="mt-10">
      <h2 class="text-2xl font-bold mb-6">📝 Moji zadaci</h2>
      <div v-if="homeStore.userTasks.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UserTaskCard
          v-for="task in homeStore.userTasks"
          :key="task.userTaskId"
         :task="task"
        />
      </div>
      <div v-else class="text-gray-500">
        Nema dostupnih zadataka.
      </div>
    </div>

    <div class="mt-10">
      <h2 class="text-2xl font-bold mb-6">🏗️ Moji projekti</h2>
      <div v-if="homeStore.userProjects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectCard
          v-for="project in homeStore.userProjects"
          :key="project.projectId"
          :project="project"
        />
      </div>
      <div v-else class="text-gray-500">
        Nema dostupnih projekata.
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { StatCard } from '#components'
import { UserTaskCard } from '#components'
import { useHomeStore } from '@/stores/home'

const homeStore = useHomeStore()

onMounted(() => {
  if (!homeStore.statistics) {
    homeStore.loadStatistics()
  }

  if (!homeStore.userTasks.length) {
    homeStore.loadUserTasks(1, 4)
  }

  if (!homeStore.userProjects.length) {
    homeStore.loadUserProjects(1, 4)
  }
})
</script>