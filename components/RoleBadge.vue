<template>
  <span
    v-if="role"
    :class="['inline-block px-2 py-1 rounded-full text-white text-xs font-semibold', badgeClass]"
  >
    {{ formattedRole }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  role: {
    type: String,
    required: false,
    default: ''
  }
})

// Odredi boju badga prema roli
const badgeClass = computed(() => {
  switch (props.role?.toLowerCase()) {
    case 'admin':
      return 'bg-red-500'
    case 'user':
      return 'bg-blue-500'
    case 'manager':
      return 'bg-green-500'
    default:
      return 'bg-gray-400'
  }
})

// Formatiraj rolu za prikaz
const formattedRole = computed(() => {
  return props.role.charAt(0).toUpperCase() + props.role.slice(1).toLowerCase()
})
</script>
