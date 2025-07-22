import { defineStore } from 'pinia'
import { fetchStatistics } from '@/composables/statistics'

export const useHomeStore = defineStore('home', {
  state: () => ({
    statistics: null,
    loading: false,
    error: null,
  }),

  actions: {
    async loadStatistics() {
      this.loading = true
      this.error = null

      try {
        const data = await fetchStatistics()
        this.statistics = data
      } catch (err) {
        this.error = 'Neuspješno učitavanje statistike.'
      } finally {
        this.loading = false
      }
    },
  },
})
