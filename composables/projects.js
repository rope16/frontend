import { createApi } from './api'

export async function getUserProjects(pageNumber, pageSize) {
    const api = createApi()
    const response = await api.get(`/project/getUserProjects?pageNumber=${pageNumber}&pageSize=${pageSize}`)
    return response.data
}

export async function searchProjects(filters) {
    const api = createApi()
    console.log('fitelrs', filters)

    const params = new URLSearchParams()

        if (filters.search) params.append('search', filters.search)
        if (filters.status) params.append('status', filters.status)
        if (filters.startFrom) params.append('startFrom', filters.startFrom)
        if (filters.endTo) params.append('endTo', filters.endTo)
        if (filters.page) params.append('page', filters.page)
        if (filters.pageSize) params.append('pageSize', filters.pageSize)
        if (filters.userId) params.append('userId', filters.userId)

    const response = await api.get(`/project/search?${params.toString()}`)
    return response.data
}

export async function createProject(params) {
    const api = createApi()
    const response = await api.post('/project/createProject', params)
    return response.data
}

export async function getProjectDetails(projectId) {
    const api = createApi()
    const response = await api.get(`/project/${projectId}/getProjectWithTasks`)
    return response.data
}

export async function updateProjectStatus(projectId, status) {
    const api = createApi()
    const response = await api.put(`/project/${projectId}/updateProjectStatus?status=${status}`)
    return response.data
}

export async function editProjectData(params) {
    const api = createApi()
    const response = await api.put(`/project/editProject`, params)
    return response.data
}