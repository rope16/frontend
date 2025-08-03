<template>
  <div
    class="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] flex flex-col gap-2"
  >
    <div class="flex justify-between items-start">
      <h3 class="text-lg font-semibold text-gray-800">
        {{ task.projectTask.projectDetails.name }}
      </h3>

      <span
        class="text-xs font-medium px-2 py-1 rounded-full"
        :class="statusBadgeClass(task.projectTask.status)"
      >
        {{ task.projectTask.status }}
      </span>
    </div>

    <div class="text-sm text-gray-600">
      Rok: 
      <span :class="isOverdue(task.projectTask.endDate) ? 'text-red-600 font-medium' : ''">
        {{ formatDate(task.projectTask.endDate) }}
      </span>
    </div>

    <div v-if="task.note" class="text-sm italic text-gray-500">
      {{ task.note }}
    </div>

    <NuxtLink
      :to="`/zadaci/${task.projectTask.projectTaskId}`"
      class="mt-2 text-sm text-blue-600 hover:underline self-start"
    >
      Detalji zadatka →
    </NuxtLink>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

defineProps({
  task: {
    type: Object,
    required: true
  }
})

function formatDate(date) {
  return dayjs(date).format('DD.MM.YYYY')
}

function isOverdue(date) {
  return dayjs().isAfter(dayjs(date), 'day')
}

function statusBadgeClass(status) {
  switch (status) {
    case 'NotStarted':
      return 'bg-gray-200 text-gray-800'
    case 'InProgress':
      return 'bg-yellow-100 text-yellow-800'
    case 'Completed':
      return 'bg-green-100 text-green-800'
    case 'Cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}
</script>