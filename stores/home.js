import { defineStore } from 'pinia'
import { fetchStatistics } from '@/composables/statistics'
import { fetchUserTasks } from '@/composables/userTasks'
import { getUserProjects } from '@/composables/projects'

export const useHomeStore = defineStore('home', {
  state: () => ({
    statistics: null,
    loading: false,
    error: null,
    userTasks: [],
    useTasksLoading: false,
    userTasksError: null,
    userProjects: [],
    userProjectsLoading: false,
    userProjectsError: null,
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

    async loadUserTasks(pageNumber, pageSize) {
      this.userTasksLoading = true
      this.userTasksError = null

      try {
        const data = await fetchUserTasks(pageNumber, pageSize)
        this.userTasks = data
      } catch (err) {
        this.userTasksError = 'Neuspješno učitavanje korisničkih zadataka.'
      } finally {
        this.userTasksLoading = false
      }
    },

    async loadUserProjects(pageNumber, pageSize) {
      this.userProjectsLoading = true
      this.userProjectsError = null

      try {
        const data = await getUserProjects(pageNumber, pageSize)
        this.userProjects = data;
      } catch (err) {
        this.userProjectsError = 'Neuspješno učitavanje projekata.'
      } finally {
        this.userProjectsLoading = false
      }
    },
  },
})
