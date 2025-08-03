<template>
  <div
    class="relative h-40 md:h-52 lg:h-64 rounded-xl overflow-hidden shadow-md transition-transform hover:scale-105 hover:shadow-lg group"
  >
    <!-- Background image -->
    <div
      class="absolute inset-0 bg-cover bg-center transition duration-300"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    ></div>

    <!-- Overlay (tamni sloj) -->
    <div
      class="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-300"
    ></div>

    <!-- Content -->
    <div class="relative z-10 h-full w-full flex flex-col justify-between p-4 text-white">
      <h3 class="text-lg md:text-xl font-semibold">{{ title }}</h3>

      <!-- Value section with soft background blur -->
      <div
        class="self-start px-3 py-1 rounded-lg bg-white/20 backdrop-blur-sm"
      >
        <p class="text-3xl font-bold">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [Number, String],
  backgroundImage: String
})
</script>