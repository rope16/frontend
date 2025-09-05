<template>
  <div class="px-6 pb-8 max-w-5xl mx-auto">
    <div v-if="project">
      <!-- Osnovne informacije -->
      <div class="bg-white rounded-xl shadow p-6 mb-8">
        <div class="flex justify-between items-center mb-2">
          <h1 class="text-2xl font-bold">{{ project.name }}</h1>
          <button
            v-if="isAdmin()"
            @click="showEditProjectModal = true"
            class="btn-primary px-4 py-2 rounded-full text-sm"
          >
            Uredi
          </button>
        </div>
        <p class="text-gray-700 mb-4">{{ project.note }}</p>

        <div class="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
          <div><strong>Početak:</strong> {{ formatDate(project.startDate) }}</div>
          <div><strong>Završetak:</strong> {{ formatDate(project.endDate) }}</div>
          <div>
            <strong>Status:</strong>
            <template v-if="isAdmin()">
              <select
                v-model="editableStatus"
                @change="updateProjectStatus(editableStatus)"
                class="ml-2 px-2 py-1 text-sm border rounded"
              >
                <option v-for="status in projectStatuses" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </template>
            <template v-else>
              <span :class="statusClass(project.status)" class="px-2 py-1 rounded-full text-xs font-semibold ml-2">
                {{ translateStatus(project.status) }}
              </span>
            </template>
          </div>
        </div>

        <!-- Informacije o gradilištu -->
        <div class="border-t pt-4 mt-4 text-sm text-gray-700 space-y-1">
          <h3 class="font-semibold text-base mb-2">Informacije o gradilištu</h3>
          <p><strong>Adresa:</strong> {{ project.constructionSiteDetails?.address }}</p>
          <p><strong>Izvođač:</strong> {{ project.constructionSiteDetails?.contractor }}</p>
          <p><strong>Investitor:</strong> {{ project.constructionSiteDetails?.investor }}</p>
        </div>
      </div>

      <!-- Lista taskova -->
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Taskovi</h2>
          <button v-if="isAdmin()" @click="showCreateTaskModal = true" class="btn-primary px-4 py-2 rounded-full text-sm">
            Dodaj task
          </button>
        </div>

        <div v-if="tasks.length">
          <div
            v-for="status in statusOrder"
            :key="status"
            class="mb-6 border border-gray-200 rounded-xl"
          >
            <!-- Klikabilna zaglavlje sekcije -->
            <div
              class="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-t-xl cursor-pointer hover:bg-gray-200 transition"
              @click="toggleGroup(status)"
            >
              <h3 class="text-base sm:text-lg font-semibold text-gray-700 flex items-center gap-2">
                {{ statusLabels[status] }}
              </h3>
              <span
                class="transition-transform duration-300"
                :class="{ 'rotate-180': !collapsedGroups[status] }"
              >
                ▼
              </span>
            </div>

            <!-- Animirani prikaz taskova -->
            <transition name="collapse">
              <div v-if="!collapsedGroups[status]" class="px-4 py-4 overflow-hidden">
                <div v-if="groupedTasks[status]?.length">
                  <ul class="space-y-4">
                    <li
                      v-for="task in groupedTasks[status]"
                      :key="task.projectTaskId"
                      class="bg-white rounded-xl shadow-md hover:shadow-lg p-5 transition-transform hover:-translate-y-1 cursor-pointer"
                      @click="goToTaskDetails(task.projectTaskId)"
                    >
                      <div class="flex justify-between items-start mb-3">
                        <h4 class="text-lg font-semibold text-gray-800">{{ task.title }}</h4>
                        <span
                          class="text-xs font-semibold px-3 py-1 rounded-full"
                          :class="getTaskStatusClass(task.status)"
                        >
                          {{ translateStatus(task.status) }}
                        </span>
                      </div>

                      <p class="text-sm text-gray-600 mb-2">
                        <strong>Napomena:</strong> {{ task.note || 'Nema napomene.' }}
                      </p>

                      <div class="text-sm text-gray-700 space-y-1">
                        <p><strong>Početak:</strong> {{ formatDate(task.startDate) }}</p>
                        <p><strong>Kraj:</strong> {{ formatDate(task.endDate) }}</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div v-else class="text-gray-500 text-sm italic">
                  Nema taskova u ovoj grupi.
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div v-else class="text-gray-500 text-sm">Nema taskova za ovaj projekat.</div>
      </div>
      <CreateProjectTaskModal
        v-if="showCreateTaskModal"
        :projectId="project.projectId"
        @close="showCreateTaskModal = false"
        @created="handleTaskCreated"
      />
      <EditProjectModal
        v-if="showEditProjectModal"
        :project="project"
        @close="showEditProjectModal = false"
        @updated="handleProjectUpdated"
      />
    </div>
    <div v-else class="text-gray-500">Učitavanje projekta...</div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projects'
import { useNavigation } from '@/utils/navigation'
import { isAdmin } from '#imports'
import CreateProjectTaskModal from '~/components/modals/CreateProjectTaskModal.vue'
import EditProjectModal from '~/components/modals/EditProjectModal.vue'
import { translateStatus } from '#imports'

const { goToProjectTaskPage } = useNavigation()

const route = useRoute()
const projectStore = useProjectStore()

const project = ref(null)
const tasks = ref([])
const editableStatus = ref(null)
const showEditProjectModal = ref(false)

const projectStatuses = [
  { label: 'Nije započeto', value: 'NotStarted' },
  { label: 'U toku', value: 'InProgress' },
  { label: 'Završeno', value: 'Completed' },
  { label: 'Otkazano', value: 'Cancelled' }
]

const statusOrder = ['InProgress', 'NotStarted', 'Completed', 'Cancelled']

const collapsedGroups = ref({
  InProgress: false,
  NotStarted: false,
  Completed: false,
  Cancelled: false
})

const statusLabels = {
  NotStarted: 'Nije započeto',
  InProgress: 'U toku',
  Completed: 'Završeno',
  Cancelled: 'Otkazano'
}

const formatDate = (date) => new Date(date).toLocaleDateString()

const statusClass = (status) => {
  switch (status) {
    case 'NotStarted': return 'bg-gray-200 text-gray-800'
    case 'InProgress': return 'bg-blue-100 text-blue-700'
    case 'Completed': return 'bg-green-200 text-green-800'
    case 'Cancelled': return 'bg-red-200 text-red-800'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getTaskStatusClass(status) {
  return statusClass(status)
}

const toggleGroup = (status) => {
  collapsedGroups.value[status] = !collapsedGroups.value[status]
}

const groupedTasks = computed(() => {
  const groups = {}
  for (const status of statusOrder) {
    groups[status] = tasks.value
      .filter(task => task.status === status)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  }
  return groups
})

const updateProjectStatus = async (status) => {
  try {
    await projectStore.updateProjectStatus(route.params.projectId, status)
    project.value.status = status
  } catch (error) {
    console.error('Greška prilikom ažuriranja statusa projekta:', error)
  }
}

const showCreateTaskModal = ref(false)

const handleTaskCreated = (newTask) => {
  tasks.value.push(newTask)
}

const goToTaskDetails = (taskId) => {
  goToProjectTaskPage(taskId)
}

const handleProjectUpdated = async () => {
  const projectId = route.params.projectId
  const data = await projectStore.getProjectDetails(projectId)
  project.value = data
}

onMounted(async () => {
  const projectId = route.params.projectId
  const data = await projectStore.getProjectDetails(projectId)
  project.value = data
  tasks.value = data?.projectTasks || []
  editableStatus.value = project?.value.status

  const initialCollapsed = {}
  projectStatuses.forEach(status => {
    initialCollapsed[status.value] = true
  })
  collapsedGroups.value = initialCollapsed
})
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 0.4s ease, opacity 0.4s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 1000px;
  opacity: 1;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
</style>