<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4"
  >
    <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-fade-in">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Dodaj korisnika na task</h2>
      
      <form @submit.prevent="addUserToTask">
        <div class="mb-4">
          <div class="mb-4">
            <div v-if="selectedUser" class="flex items-center mb-4 p-4 border border-gray-300 rounded-xl bg-gray-50 shadow-sm">
              <Avatar :name="fullName(selectedUser)" size="sm" class="mr-4" />
              <div class="flex flex-1 items-center justify-between">
                <div class="text-sm">
                  <p class="font-semibold">{{ fullName(selectedUser) }}</p>
                  <p class="text-gray-600">{{ selectedUser.email }}</p>
                </div>
                <button
                  @click="selectedUser = null"
                  class="text-red-600 text-xs hover:underline"
                >
                  Ukloni
                </button>
              </div>
            </div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pretraga korisnika</label>
            <input
              type="text"
              v-model="query"
              @input="onSearchInput"
              placeholder="Ime, prezime ili email..."
              class="input w-full"
            />
          </div>

          <!-- Lista rezultata -->
          <div v-if="searchResults.length" class="mb-4 border rounded-xl divide-y divide-gray-100">
            <button
              v-for="user in searchResults"
              :key="user.userId"
              @click="selectUser(user)"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            class="btn-secondary px-4 py-2 rounded-full"
            @click="$emit('close')"
          >
            Otkaži
          </button>
          <button
            type="submit"
            class="btn-primary px-4 py-2 rounded-full"
          >
            Dodaj
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { debounce } from 'lodash-es'
import { useUsersStore } from '@/stores/users'
import { useProjectTaskStore } from '@/stores/projectTasks'
import { useRoute } from 'vue-router'
import Avatar from '../Avatar.vue'

const query = ref('')
const searchResults = ref([])
const selectedUser = ref(null)
const emit = defineEmits(['close'])

const usersStore = useUsersStore()
const store = useProjectTaskStore()
const route = useRoute()

const assignedUsers = computed(() => store.taskDetails.data?.projectTaskUsers || [])

const onSearchInput = debounce(async () => {
  if (!query.value.trim()) {
    searchResults.value = []
    return
  }

  await usersStore.searchUsers({ query: query.value.trim(), page: 1, pageSize: 5 })

  const assignedIds = assignedUsers.value.map(u => u.userId)
  
  searchResults.value = usersStore.users.filter(
    user => !assignedIds.includes(user.userId)
  )
}, 400)

const selectUser = (user) => {
  selectedUser.value = user
  query.value = ''
  searchResults.value = []
}

const addUserToTask = async () => {
  if (!selectedUser.value) return

  const taskId = route.params.projectTaskId
  const data = await store.createUserTask(taskId, selectedUser.value.userId)

  store.addUserTask(data);

  emit('close');

  selectedUser.value = null
}

const fullName = (user) => {
  return `${user.firstName} ${user.lastName}`
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