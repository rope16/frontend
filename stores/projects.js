import { defineStore } from "pinia";
import { getProjectDetails } from "~/composables/projects";

export const useProjectStore = defineStore("projects", {
    state: () => ({
        projects: [],
        totalCount: 0,
        loading: false,
        createProjectData: { data: null, loading: false, error: null },
        projectDetails: {data: null, loading: false, error: null}
    }),
    actions: {
        async searchProjects(filters) {
            this.loading = true
            try {
                const data = await searchProjects(filters)
                this.projects = data.projects
                this.totalCount = data.count
            } catch (error) {
                console.error("Error searching projects:", error)
            } finally {
                this.loading = false
            }
        },
        async createProject(projectData) {
            this.loading = true
            this.error = null
            try {
                this.createProjectData.data = await createProject(projectData)
            } catch (error) {
                this.createProjectData.error = error
            } finally {
                this.createProjectData.loading = false
            }
        },
        async getProjectDetails(projectId) {
            this.projectDetails.loading = true
            this.projectDetails.error = null
            try {
                const data = await getProjectDetails(projectId)
                this.projectDetails.data = data
                return data
            } catch (error) {
                this.projectDetails.error = error
            } finally {
                this.projectDetails.loading = false
            }
        },
        async updateProjectStatus(projectId, status) {
            try {
                await updateProjectStatus(projectId, status)
            } catch (error) {
                console.error("Error updating project status:", error)
            } finally {
                this.projectDetails.loading = false
            }
        },
        async editProject(projectData) {
            try {
                const editedProject = await editProjectData(projectData);
                this.projectDetails.data = editedProject;
            } catch (error) {
                console.error("Error editing project:", error)
            }
        }
    }
})
