import { createApi } from './api'

export async function getUserProjects(pageNumber, pageSize) {
    const api = createApi()
    const response = await api.get(`/project/getUserProjects?pageNumber=${pageNumber}&pageSize=${pageSize}`)
    return response.data
}