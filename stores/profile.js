import { defineStore } from 'pinia'
import { fetchProfile } from '@/composables/profile'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchUserProfile(userId) {
      this.loading = true
      this.error = null
      try {
        this.profile = await fetchProfile(userId)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      } 
    }
  }
})