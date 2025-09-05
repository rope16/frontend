<template>
  <div class="px-6 mx-auto">
    <!-- Filter sekcija -->
		 	<div class="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4 sm:gap-8">
				<div class="flex flex-col md:flex-row md:items-end md:space-x-4 flex-1 gap-4 sm:gap-0">
        	<!-- Pretraga po naslovu -->
					<div class="">
						<label class="block text-sm font-medium text-gray-700 mb-1">Pretraga po naslovu</label>
						<input v-model="filters.search" class="input w-full" placeholder="Unesi naslov..." />
					</div>

					<!-- Status -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
						<select v-model="filters.status" class="input">
							<option value="">Svi</option>
							<option v-for="status in statuses" :key="status.value" :value="status.value">{{ status.label }}</option>
						</select>
					</div>

					<!-- Datumi -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Od</label>
						<input v-model="filters.startFrom" type="date" class="input" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Do</label>
						<input v-model="filters.endTo" type="date" class="input" />
					</div>

					<!-- Pretraga po korisniku (samo admin) -->
					<div v-if="isAdmin()" class="relative w-full md:w-80">
						<label class="block text-sm font-medium text-gray-700 mb-1">Pretraga po korisniku</label>
						<input
							v-model="userSearchQuery"
							@input="onUserSearch"
							placeholder="Ime, prezime ili email..."
							class="input"
						/>
						<div v-if="userSearchResults.length" class="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-xl mt-1 shadow-md overflow-hidden">
							<button
								v-for="user in userSearchResults"
								:key="user.userId"
								class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
								@click="selectUser(user)"
							>
								{{ user.firstName }} {{ user.lastName }} ({{ user.email }})
							</button>
						</div>
					</div>
				</div>

				<div class="flex sm:justify-end" style="margin-bottom: 3px;">
					<button @click="searchTasks" class="btn-primary px-4 py-2 rounded-full">Pretraži</button>
				</div>
			</div>

    <!-- Grid prikaz taskova -->
    <div v-if="tasks.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
				v-for="task in tasks"
				:key="task.projectTaskId"
				class="bg-white shadow rounded-xl p-5 transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 cursor-pointer"
				@click="goToTaskDetails(task.projectTaskId)"
			>
				<h3 class="text-lg font-semibold mb-2">{{ task.title }}</h3>
				<p class="text-sm text-gray-600 mb-2">{{ task.note }}</p>
				<div class="flex items-center gap-1">
					<p class="text-sm"><strong>Početak:</strong></p>
					<span
						class="text-xs font-semibold px-3 py-1 rounded-full"
						:class="statusClass(task.status)"
					>
							{{ translateStatus(task.status) }}
					</span>
				</div>
				<p class="text-sm pt-1"><strong>Početak:</strong> {{ formatDate(task.startDate) }}</p>
				<p class="text-sm pt-1"><strong>Kraj:</strong> {{ formatDate(task.endDate) }}</p>
			</div>
    </div>

    <div v-else class="text-center text-gray-500 mt-10">Nema pronađenih taskova.</div>

		<!-- Paginacija -->
		<div v-if="totalPages > 1" class="flex justify-center mt-8 space-x-2">
			<button
				@click="goToPage(currentPage - 1)"
				:disabled="currentPage === 1"
				class="px-3 py-1 rounded border text-sm"
				:class="currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-100'"
			>
				Prethodna
			</button>

			<button
				v-for="page in totalPages"
				:key="page"
				@click="goToPage(page)"
				class="px-3 py-1 rounded border text-sm"
				:class="page === currentPage ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'"
			>
				{{ page }}
			</button>

			<button
				@click="goToPage(currentPage + 1)"
				:disabled="currentPage === totalPages"
				class="px-3 py-1 rounded border text-sm"
				:class="currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-100'"
			>
				Sledeća
			</button>
		</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useProjectTaskStore } from '@/stores/projectTasks'
import { debounce } from 'lodash-es'
import { isAdmin } from '#imports'
import { useNavigation } from '#imports'
import { useAuthStore } from '#imports'
import { translateStatus } from '#imports'

const usersStore = useUsersStore()
const taskStore = useProjectTaskStore()
const authStore = useAuthStore()

const { goToProjectTaskPage } = useNavigation()

const tasks = ref([])
const userSearchQuery = ref('')
const userSearchResults = ref([])
const selectedUserId = ref(null)

const filters = ref({
  search: '',
  status: '',
  startFrom: '',
  endTo: '',
  userId: null,
  page: 1,
  pageSize: 6
})

const statuses = [
  { label: 'Nije započeto', value: 'NotStarted' },
  { label: 'U toku', value: 'InProgress' },
  { label: 'Završeno', value: 'Completed' },
  { label: 'Otkazano', value: 'Cancelled' }
]

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString()

const totalCount = ref(0)
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(totalCount.value / filters.value.pageSize))

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  filters.value.page = page
  searchTasks()
}

const searchTasks = async () => {
  filters.value.userId = isAdmin() ? selectedUserId.value : authStore.user.userId;
  filters.value.page = currentPage.value

  await taskStore.searchProjectTasks(filters.value)
  tasks.value = taskStore.tasks.data.tasks
  totalCount.value = taskStore.tasks.data.count
}

const onUserSearch = debounce(async () => {
  if (!userSearchQuery.value.trim()) {
    userSearchResults.value = []
    return
  }

  await usersStore.searchUsers({
    term: userSearchQuery.value.trim(),
    page: 1,
    pageSize: 5
  })

  userSearchResults.value = usersStore.users
}, 400)

const selectUser = (user) => {
  selectedUserId.value = user.userId
  userSearchQuery.value = `${user.firstName} ${user.lastName}`
  userSearchResults.value = []
}

const goToTaskDetails = (taskId) => {
  goToProjectTaskPage(taskId)
}

const statusClass = (status) => {
  switch (status) {
    case 'NotStarted':
      return 'bg-gray-200 text-gray-700'
    case 'InProgress':
      return 'bg-blue-100 text-blue-700'
    case 'Completed':
      return 'bg-green-100 text-green-700'
    case 'Cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

onMounted(() => {
  searchTasks()
})

</script>

<style scoped>
.input {
  @apply px-4 py-2 rounded-xl border border-gray-300 shadow-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 font-semibold;
}
</style>
