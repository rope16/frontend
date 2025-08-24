<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Uredi gradilište</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Adresa</label>
          <input v-model="form.address" class="input w-full" />
          <p v-if="errors.address" class="text-red-500 text-xs mt-1">{{ errors.address }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Izvođač</label>
          <input v-model="form.contractor" class="input w-full" />
          <p v-if="errors.contractor" class="text-red-500 text-xs mt-1">{{ errors.contractor }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Investitor</label>
          <input v-model="form.investor" class="input w-full" />
          <p v-if="errors.investor" class="text-red-500 text-xs mt-1">{{ errors.investor }}</p>
        </div>
      </div>

      <div class="flex justify-end space-x-2 mt-6">
        <button @click="$emit('close')" class="text-sm px-4 py-2 rounded hover:underline">Otkaži</button>
        <button @click="submit" class="btn-primary px-4 py-2 rounded-full text-sm">Sačuvaj</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useConstructionSitesStore } from '@/stores/constructionSites'

const props = defineProps({
  site: Object
})
const emit = defineEmits(['close', 'updated'])

const store = useConstructionSitesStore()

const form = reactive({
  address: props.site.address,
  contractor: props.site.contractor,
  investor: props.site.investor
})

const errors = reactive({
  address: '',
  contractor: '',
  investor: ''
})

const validate = () => {
  let valid = true
  errors.address = !form.address.trim() ? 'Adresa je obavezna.' : ''
  errors.contractor = !form.contractor.trim() ? 'Izvođač je obavezan.' : ''
  errors.investor = !form.investor.trim() ? 'Investitor je obavezan.' : ''

  if (errors.address || errors.contractor || errors.investor) {
    valid = false
  }

  return valid
}

const submit = async () => {
  if (!validate()) return

  await store.editConstructionSite({
    constructionSiteId: props.site.constructionSiteId,
    address: form.address,
    contractor: form.contractor,
    investor: form.investor
  })

  emit('updated')
  emit('close')
}
</script>

<style scoped>
.input {
  @apply mt-1 block w-full px-4 py-2 text-sm bg-white border border-gray-300 
    rounded-md shadow-sm placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>