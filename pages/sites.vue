<template>
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex justify-between items-center mb-4">
			<input v-model="searchQuery" placeholder="Pretraga po adresi..." class="input w-full max-w-xs" />
			<button v-if="isAdmin()" @click="showCreateModal = true" class="btn-primary px-4 py-2 rounded-full cursor-pointer text-sm">
				+ Dodaj gradilište
			</button>
		</div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white shadow rounded-xl">
        <thead>
          <tr class="text-left bg-gray-100 text-sm text-gray-600">
            <th class="px-4 py-3">Adresa</th>
            <th class="px-4 py-3">Izvođač</th>
            <th class="px-4 py-3">Investitor</th>
            <th class="px-4 py-3" v-if="isAdmin()">Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="site in sites"
            :key="site.constructionSiteId"
            class="border-t text-sm text-gray-800 hover:bg-gray-50 transition"
          >
            <td class="px-4 py-3">{{ site.address }}</td>
            <td class="px-4 py-3">{{ site.contractor }}</td>
            <td class="px-4 py-3">{{ site.investor }}</td>
            <td class="px-4 py-3" v-if="isAdmin()">
              <button class="text-blue-600 hover:underline text-sm" @click="openEditModal(site)">Uredi</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-6 flex justify-end gap-2 text-sm">
        <button
          class="btn-secondary px-4 py-2 rounded-full cursor-pointer"
          :disabled="page === 1"
          @click="prevPage"
        >
          Prethodna
        </button>
        <button
          class="btn-primary px-4 py-2 rounded-full cursor-pointer"
          :disabled="page * pageSize >= total"
          @click="nextPage"
        >
          Sledeća
        </button>
      </div>
    </div>

		<EditConstructionSiteModal
			v-if="showEditModal"
			:site="selectedSite"
			@close="showEditModal = false"
			@updated="fetchSites"
		/>

		<CreateConstructionSiteModal
			v-if="showCreateModal"
			@close="showCreateModal = false"
			@created="fetchSites"
		/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { debounce } from 'lodash-es'
import { useConstructionSitesStore } from '@/stores/constructionSites'
import { isAdmin } from '#imports'
import EditConstructionSiteModal from '~/components/modals/EditConstructionSiteModal.vue'
import CreateConstructionSiteModal from '~/components/modals/CreateConstructionSiteModal.vue'

const constructionSiteStore = useConstructionSitesStore()

const searchQuery = ref('')
const sites = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = 10

const showEditModal = ref(false)
const selectedSite = ref(null)
const showCreateModal = ref(false)

const openEditModal = (site) => {
  selectedSite.value = site
  showEditModal.value = true
}


const fetchSites = async () => {
  await constructionSiteStore.searchConstructionSites({
    query: searchQuery.value.trim(),
    page: page.value,
    pageSize
  })

  sites.value = constructionSiteStore.searchConstructionSitesRes?.data?.sites
  total.value = constructionSiteStore.searchConstructionSitesRes?.data?.count
}

const debouncedSearch = debounce(() => {
  page.value = 1
  fetchSites()
}, 400)

const nextPage = () => {
  if (page.value * pageSize < total.value) {
    page.value++
    fetchSites()
  }
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchSites()
  }
}

fetchSites()
</script>

<style scoped>
.input {
  @apply px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 font-semibold;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold;
}
</style>