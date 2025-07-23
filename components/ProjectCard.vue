<template>
  <div
    class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 flex flex-col gap-2"
  >
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-xl font-semibold text-gray-800 truncate">
        {{ project.name }}
      </h2>
      <span :class="statusBadgeClass">{{ project.status }}</span>
    </div>
    <p class="text-gray-600 text-sm line-clamp-2">{{ project.note }}</p>
    <div class="text-sm text-gray-500 mt-auto">
      <span>📅 {{ formatDate(project.startDate) }} – {{ formatDate(project.endDate) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  project: Object,
})

const formatDate = (date) => dayjs(date).format('DD.MM.YYYY')

const statusBadgeClass = computed(() => {
  const base = 'px-2 py-1 rounded-full text-xs font-semibold'
  switch (props.project.status) {
    case 'NotStarted':
      return `${base} bg-gray-200 text-gray-800`
    case 'InProgress':
      return `${base} bg-blue-100 text-blue-800`
    case 'Completed':
      return `${base} bg-green-100 text-green-800`
    case 'Cancelled':
      return `${base} bg-red-100 text-red-800`
    default:
      return `${base} bg-gray-100 text-gray-700`
  }
})
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>