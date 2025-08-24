<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
    <div class="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl relative animate-fade-in">
      <!-- Naslov -->
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Dodaj novi task</h2>

      <!-- Forma -->
      <form @submit.prevent="submit" class="space-y-4">
        <!-- Naslov taska -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Naslov</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Unesi naslov taska"
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
import { ref } from 'vue'
import { createProjectTask } from '#imports'

const emit = defineEmits(['close', 'created'])
const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
})

const form = ref({
  title: '',
  note: '',
  startDate: '',
  endDate: ''
})

const submit = async () => {
  try {
    const payload = {
      ...form.value,
      projectId: props.projectId
    }

    const newTask = await createProjectTask(payload)
    emit('created', newTask)
    emit('close')
  } catch (error) {
    console.error('Greška pri kreiranju taska:', error)
  }
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