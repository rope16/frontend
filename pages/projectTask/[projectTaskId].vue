<template>
  <div class="px-6 pb-8 max-w-5xl mx-auto">
    <div v-if="task">
      <!-- Naslov zadatka -->
      <div class="mb-6 flex justify-between items-start gap-4">
        <div>
          <h1 class="text-2xl font-bold mb-2">{{ task.title }}</h1>
          <p class="text-gray-600">{{ task.note }}</p>
        </div>
        <button
          v-if="isAdmin()"
          @click="showEditModal = true"
          class="btn-primary text-sm px-3 py-2 rounded-full hover:bg-gray-200 transition"
          title="Uredi zadatak"
        >
          Uredi
        </button>
      </div>

      <!-- Detalji zadatka -->
      <div class="bg-white rounded-xl shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Detalji zadatka</h2>
        <div class="text-sm text-gray-700 space-y-2">
          <p>
            <strong>Status:</strong>
            <template v-if="isAdmin()">
              <select
                v-model="task.status"
                @change="updateTaskStatus"
                class="ml-2 px-2 py-1 text-sm border rounded"
              >
                <option v-for="option in taskStatusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </template>
            <span v-else :class="statusClass(task.status)" class="ml-2 px-2 py-1 text-xs rounded-full font-semibold">
              {{ translateStatus(task.status) }}
            </span>
          </p>
          <p><strong>Početak:</strong> {{ formatDate(task.startDate) }}</p>
          <p><strong>Kraj:</strong> {{ formatDate(task.endDate) }}</p>
        </div>
      </div>

      <!-- Detalji projekta -->
      <div class="bg-white rounded-xl shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Projekat</h2>
        <div class="text-sm text-gray-700 space-y-2">
          <p><strong>Naziv:</strong> {{ task.projectDetails.name }}</p>
          <p><strong>Napomena:</strong> {{ task.projectDetails.note || 'Nema napomene.' }}</p>
          <p><strong>Početak:</strong> {{ formatDate(task.projectDetails.startDate) }}</p>
          <p><strong>Kraj:</strong> {{ formatDate(task.projectDetails.endDate) }}</p>
          <p>
            <strong>Status:</strong>
            <span :class="statusClass(task.projectDetails.status)" class="ml-2 px-2 py-1 text-xs rounded-full font-semibold">
              {{ translateStatus(task.projectDetails.status) }}
            </span>
          </p>
        </div>
      </div>

      <!-- Dodijeljeni korisnici -->
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Korisnici na zadatku</h2>
          <button
            v-if="isAdmin()"
            @click="showUserTaskModal = true"
            class="btn-primary px-3 py-2 rounded-full text-sm"
          >
            + Dodaj korisnika
          </button>
        </div>
        <div v-if="task.projectTaskUsers.length">
          <ul class="space-y-4">
            <li
              v-for="user in task.projectTaskUsers"
              :key="user.userId"
              class="p-4 border border-gray-200 rounded-xl shadow-sm text-sm text-gray-800 bg-gray-50 transition duration-300 ease-in-out hover:shadow-md hover:bg-white"
            >
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <!-- Avatar i podaci -->
                <div class="flex items-center">
                  <Avatar :name="fullName(user)" size="sm" class="mr-4" />
                  <div>
                    <p class="mb-1 leading-tight">
                      <strong class="mr-1 block sm:inline">{{ user.firstName }} {{ user.lastName }}</strong>
                      <span class="block sm:inline text-gray-500">({{ user.email }})</span>
                    </p>
                    <p class="text-sm">
                      Status:
                      <span :class="user.isActive ? 'text-green-600' : 'text-red-600'">
                        {{ user.isActive ? 'Aktivan' : 'Neaktivan' }}
                      </span>
                    </p>
                  </div>
                </div>

                <!-- Dugme za uklanjanje -->
                <div v-if="isAdmin()" class="sm:mt-0 mt-2">
                  <button
                    @click="removeUserFromTask(user)"
                    class="text-red-500 hover:text-red-700 text-xs font-semibold"
                    title="Ukloni korisnika"
                  >
                    Ukloni
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-else class="text-sm text-gray-500">Nema korisnika dodijeljenih ovom tasku.</div>

        <AddUserTaskModal v-if="showUserTaskModal" @close="showUserTaskModal = false" />
        <EditProjectTaskModal
          v-if="showEditModal"
          :task="task"
          @close="showEditModal = false"
          @updated="refetch"
        />
      </div>
    </div>

    <div v-else class="text-gray-500">Učitavanje podataka...</div>
  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectTaskStore } from '@/stores/projectTasks'
import Avatar from '~/components/Avatar.vue'
import AddUserTaskModal from '~/components/modals/AddUserTaskModal.vue'
import { isAdmin } from '#imports'
import EditProjectTaskModal from '~/components/modals/EditProjectTaskModal.vue'
import { translateStatus } from '#imports'

const route = useRoute()
const store = useProjectTaskStore()
const task = ref(null)
const showUserTaskModal = ref(false)
const showEditModal = ref(false)

const taskStatusOptions = [
  { label: 'Nije započeto', value: 'NotStarted' },
  { label: 'U toku', value: 'InProgress' },
  { label: 'Završeno', value: 'Completed' },
  { label: 'Otkaženo', value: 'Cancelled' }
]

onMounted(async () => {
  const id = route.params.projectTaskId
  await store.fetchProjectTaskDetails(id)
  task.value = store.taskDetails.data
})

const refetch = async () => {
  const id = route.params.projectTaskId
  await store.fetchProjectTaskDetails(id)
  task.value = store.taskDetails.data
}

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString()

const statusClass = (status) => {
  switch (status) {
    case 'NotStarted': return 'bg-gray-200 text-gray-800'
    case 'InProgress': return 'bg-blue-100 text-blue-700'
    case 'Completed': return 'bg-green-200 text-green-800'
    case 'Cancelled': return 'bg-red-200 text-red-800'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const fullName = (user) => {
  return `${user.firstName} ${user.lastName}`
}

const removeUserFromTask = async (userTask) => {
  const confirmed = confirm(`Da li ste sigurni da želite ukloniti korisnika ${userTask.firstName} ${userTask.lastName} sa zadatka?`)
  if (!confirmed) return

  await store.removeUserTask(userTask.userTaskId)
}

const updateTaskStatus = async () => {
  if (!task.value) return

  const newStatus = task.value.status
  await store.changeProjectTaskStatus(task.value.projectTaskId, newStatus)
}
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
</style>