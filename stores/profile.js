import { defineStore } from 'pinia'
import { fetchProfile } from '@/composables/profile'
import { useAuthStore } from '#imports'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null,
    loading: false,
    error: null,
    editProfile: { data: null, loading: false, error: null },
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
    },
    async updateUserProfile(userId, profileData) {
      this.editProfile.loading = true
      this.editProfile.error = null
      try {
        this.profile = await updateProfile(userId, profileData)
        this.editProfile.data = this.profile

        const authStore = useAuthStore()
        if (authStore.user.userId === userId) {
          authStore.user.email = this.profile.email
          authStore.user.name = this.profile.firstName + ' ' + this.profile.lastName
        }
      } catch (error) {
        this.editProfile.error = error
      } finally {
        this.editProfile.loading = false
      }
    },
  }
})