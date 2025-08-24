import { defineStore } from 'pinia'
import { fetchConstructionSites } from '@/composables/constructionSites'

export const useConstructionSitesStore = defineStore('constructionSites', {
  state: () => ({
    constructionSites: [],
    loading: false,
    searchConstructionSitesRes: {data: null, loading: false, error: null }
  }),
  actions: {
    async fetchConstructionSites() {
      this.loading = true
      try {
        this.constructionSites = await fetchConstructionSites()
      } catch (error) {
        console.error('Error fetching construction sites:', error)
      } finally {
        this.loading = false
      }
    },
    async searchConstructionSites(params) {
      this.searchConstructionSitesRes.loading = true
      try {
        this.searchConstructionSitesRes.data = await searchConstructionSites(params)
      } catch (error) {
        this.searchConstructionSitesRes.error = error
        console.error('Error searching construction sites:', error)
      } finally {
        this.searchConstructionSitesRes.loading = false
      }
    },
    async editConstructionSite(params) {
      try {
        var editedSite = await updateConstructionSite(params)

       // Ako je data lista već učitana
      if (this.searchConstructionSitesRes.data?.sites) {
        const index = this.searchConstructionSitesRes.data.sites.findIndex(
          s => s.constructionSiteId === editedSite.constructionSiteId
        )

        if (index !== -1) {
          this.searchConstructionSitesRes.data.sites[index] = editedSite
        }
      }

      return editedSite;
      } catch(error) {
        console.error('Error editing construction site:', error)
      }
    },
    async createConstructionSite(params) {
      try {
        const newSite = await createConstructionSite(params)

        // Ako je učitana lista iz search-a, ubaci novi site na početak
        if (this.searchConstructionSitesRes.data?.sites) {
          this.searchConstructionSitesRes.data.sites.unshift(newSite)
        }

        return newSite
      } catch (error) {
        console.error('Error creating construction site:', error)
        throw error
      }
    }
  }
})