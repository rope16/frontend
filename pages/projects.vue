<template>
  <div class="px-6 pb-4">
    <div v-if="!store.loading">
        <!-- Search i filter sekcija -->
        <div class="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div class="flex flex-col sm:flex-row gap-4 w-full">
                <input
                v-model="filters.search"
                type="text"
                placeholder="Pretraži projekte..."
                class="input w-full sm:w-64"
                />
                <select v-model="filters.status" class="input">
                <option value="">Status</option>
                <option value="NotStarted">Nije zapocet</option>
                <option value="InProgress">U toku</option>
                <option value="Completed">Završen</option>
                <option value="Cancelled">Otkazan</option>
                </select>
                <input type="date" v-model="filters.startFrom" class="input" />
                <input type="date" v-model="filters.endTo" class="input" />
            </div>
            <div class="flex justify-end items-center">
                <button v-if="showAddButton" @click="showAddModal = true" class="btn-primary rounded-full px-4 h-11 w-max">
                    Dodaj projekat
                </button>
            </div>
        </div>

        <!-- Grid projekata -->
        <div v-if="store.projects.length > 0">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    v-for="project in store.projects"
                    :key="project.projectId"
                    class="bg-white p-5 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition duration-200 cursor-pointer"
                    @click="navigateToProject(project.projectId)"
                >
                    <h2 class="text-lg font-bold text-gray-800 mb-1">{{ project.name }}</h2>
                    <p class="text-sm text-gray-600 mb-2">{{ project.note }}</p>

                    <div class="text-sm text-gray-700 mb-1">
                    📅 {{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}
                    </div>
                    <div class="mb-2">
                    <span
                        class="text-xs font-semibold px-3 py-1 rounded-full"
                        :class="statusClass(project.status)"
                    >
                        {{ translateStatus(project.status) }}
                    </span>
                    </div>

                    <div class="text-sm text-gray-700">
                    <p><strong>Adresa:</strong> {{ project.constructionSiteDetails.address }}</p>
                    <p><strong>Izvođač:</strong> {{ project.constructionSiteDetails.contractor }}</p>
                    <p><strong>Investitor:</strong> {{ project.constructionSiteDetails.investor }}</p>
                    </div>
                </div>
            </div>

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
        <div v-else class="text-center text-gray-500">
            <p>Nema projekata koji odgovaraju filterima.</p>
        <div></div>
    </div>
    <div v-else class="text-center text-gray-500">
        <p>Projekti se ucitavaju.</p>
    </div>
  </div>
  <AddProjectModal
    v-if="showAddModal"
    @close="showAddModal = false"
    @project-added="handleProjectAdded"
  />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useProjectStore } from '@/stores/projects'
import { isAdmin } from '#imports'
import { useNavigation } from '#imports'
import AddProjectModal from '~/components/modals/AddProjectModal.vue'
import dayjs from 'dayjs'
import { useAuthStore } from '#imports'
import { translateStatus } from '#imports'

const { goToProject } = useNavigation()

const showAddButton = isAdmin()

const showAddModal = ref(false)

const store = useProjectStore()
const authStore = useAuthStore()

const totalCount = ref(0)
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(totalCount.value / filters.value.pageSize))

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  filters.value.page = page
  store.searchProjects(filters.value)
}

const filters = ref({
  search: '',
  status: '',
  startFrom: '',
  endTo: '',
  page: 1,
  pageSize: 6,
  userId: isAdmin() ? null : authStore.user.userId
})

let debounceTimeout

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

const formatDate = (date) => dayjs(date).format('DD.MM.YYYY')

onMounted(async () => {
  await store.searchProjects(filters.value)
  totalCount.value = store.totalCount
})

const handleProjectAdded = () => {
  showAddModal.value = false
  store.searchProjects(filters.value)
  totalCount.value = store.totalCount
}

const navigateToProject = (projectId) => {
  goToProject(projectId)
}

watch(filters, (newFilters) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    store.searchProjects(newFilters)
  }, 500)
}, { deep: true })
</script>

<style scoped>
.input {
  @apply px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
</style>
