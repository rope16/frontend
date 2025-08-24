<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Uredi projekat</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Naziv</label>
          <input v-model="form.name" class="input w-full" />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Napomena</label>
          <textarea v-model="form.note" class="input w-full" rows="3" />
          <p v-if="errors.note" class="text-red-500 text-xs mt-1">{{ errors.note }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Početak</label>
          <input v-model="form.startDate" type="date" class="input w-full" />
          <p v-if="errors.startDate" class="text-red-500 text-xs mt-1">{{ errors.startDate }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Završetak</label>
          <input v-model="form.endDate" type="date" class="input w-full" />
          <p v-if="errors.endDate" class="text-red-500 text-xs mt-1">{{ errors.endDate }}</p>
        </div>
      </div>

      <div class="flex justify-end space-x-2 mt-6">
        <button @click="$emit('close')" class="btn-secondary px-4 py-2 rounded-full text-sm">Otkaži</button>
        <button
          :disabled="!isFormValid"
          @click="submit"
          class="btn-primary px-4 py-2 rounded-full text-sm"
        >
          Sačuvaj
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useProjectStore } from '@/stores/projects'

const emit = defineEmits(['close', 'updated'])
const props = defineProps({ project: Object })

const projectStore = useProjectStore()

const form = reactive({
  name: props.project.name,
  note: props.project.note || '',
  startDate: props.project.startDate?.split('T')[0],
  endDate: props.project.endDate?.split('T')[0]
})

const errors = reactive({
  name: '',
  note: '',
  startDate: '',
  endDate: ''
})

const validateForm = () => {
  errors.name = form.name.trim() ? '' : 'Naziv je obavezan.'
  errors.startDate = form.startDate ? '' : 'Početni datum je obavezan.'
  errors.endDate = form.endDate ? '' : 'Završni datum je obavezan.'

  if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
    errors.endDate = 'Završni datum ne može biti prije početnog.'
  }

  return !errors.name && !errors.startDate && !errors.endDate
}

const isFormValid = computed(() => {
  return (
    form.name.trim() &&
    form.note.trim() &&
    form.startDate &&
    form.endDate &&
    new Date(form.endDate) >= new Date(form.startDate)
  )
})

const submit = async () => {
  if (!validateForm()) return

  await projectStore.editProject({
    projectId: props.project.projectId,
    name: form.name,
    note: form.note,
    startDate: new Date(form.startDate).toISOString(),
    endDate: new Date(form.endDate).toISOString()
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
  transition: border 0.2s, box-shadow 0.2s;
}
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-secondary {
  @apply bg-gray-300 hover:bg-gray-400 text-black px-4 py-2;
}
</style>