<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
    <div class="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl relative animate-fade-in">
      <!-- Naslov -->
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Dodaj novi projekat</h2>

      <!-- Forma -->
      <form @submit.prevent="submit" class="space-y-4">
        <!-- Naziv projekta -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Naziv projekta</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Unesi naziv projekta"
            class="input w-full"
            required
          />
        </div>

        <!-- Napomena -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Napomena</label>
          <textarea
            v-model="form.note"
            placeholder="Unesi dodatne napomene"
            class="input w-full resize-none"
            rows="3"
          />
        </div>

        <!-- Datumi -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Početni datum</label>
            <input
              v-model="form.startDate"
              type="date"
              class="input w-full"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Završni datum</label>
            <input
              v-model="form.endDate"
              type="date"
              class="input w-full"
              required
            />
          </div>
        </div>

        <!-- Gradilište -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Gradilište</label>
          <select
            v-model="selectedConstructionSiteId"
            class="input w-full"
            required
          >
            <option value="" disabled selected>Odaberi gradilište</option>
            <option
              v-for="site in constructionSites"
              :key="site.constructionSiteId"
              :value="site.constructionSiteId"
            >
              {{ site.address }} ({{ site.contractor }} / {{ site.investor }})
            </option>
          </select>
        </div>

        <!-- Dugmad -->
        <div class="flex justify-end gap-3 pt-4 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-secondary py-2 px-4 rounded-full"
          >
            Otkaži
          </button>
          <button type="submit" class="btn-primary py-2 px-4 rounded-full">
            Sačuvaj
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useProjectStore } from '@/stores/projects'
import { useConstructionSitesStore } from '#imports'

const emit = defineEmits(['close', 'project-added'])
const store = useProjectStore()
const constructionSitesStore = useConstructionSitesStore()

const constructionSites = ref([])
const selectedConstructionSiteId = ref('')

onMounted(async () => {
  await constructionSitesStore.fetchConstructionSites()
  constructionSites.value = constructionSitesStore.constructionSites
})

const form = ref({
  name: '',
  note: '',
  startDate: '',
  endDate: '',
})

const submit = async () => {
  const payload = {
    ...form.value,
    constructionSiteId: selectedConstructionSiteId.value
  }
  console.log('payload', payload)

  await store.createProject(payload)
  emit('project-added')
}
</script>

<style scoped>
.input {
  @apply px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 font-semibold;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300 font-semibold;
}
</style>