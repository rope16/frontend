<template>
    <div
        class="bg-white p-5 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
    >
    <div class="flex items-center gap-2 mb-2">
      <div class="text-3xl">{{ icon }}</div>
      <h2 class="text-lg font-semibold text-gray-700">{{ title }}</h2>
    </div>
    <p class="text-3xl font-bold text-gray-900">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  title: String,
  value: [Number, String],
})
</script>