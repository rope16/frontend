<template>
  <div
    class="rounded-full flex items-center justify-center text-white font-semibold"
    :class="[sizeClass]"
    :style="{ backgroundColor: avatarColor }"
  >
    <span class="text-lg">{{ initials }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md' // 'sm' | 'md' | 'lg'
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-10 h-10 text-sm'
    case 'lg': return 'w-20 h-20 text-2xl'
    default: return 'w-16 h-16 text-base'
  }
})

const initials = computed(() => {
  const parts = props.name.trim().split(' ')
  return parts.length > 1
    ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
    : parts[0][0].toUpperCase()
})

const colorPalette = [
  '#3B82F6', // blue-500
  '#10B981', // green-500
  '#F59E0B', // yellow-500
  '#EF4444', // red-500
  '#8B5CF6', // purple-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#6366F1', // indigo-500
  '#F43F5E', // rose-500
  '#84CC16'  // lime-500
]

function hashStringToIndex(str, mod) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % mod
}

const avatarColor = computed(() => {
  const index = hashStringToIndex(props.name, colorPalette.length)
  return colorPalette[index]
})
</script>