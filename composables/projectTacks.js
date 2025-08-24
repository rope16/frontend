import { createApi } from './api'

export async function createProjectTask(taskData) {
    const api = createApi()
    const response = await api.post(`api/ProjectTask/createProjectTask`, taskData)
    return response.data
}

export async function getProjectTaskDetails(projectTaskId) {
    const api = createApi()
    const response = await api.get(`api/ProjectTask/${projectTaskId}/details`)
    return response.data
}

export async function updateProjectTaskStatus(projectTaskId, status) {
    const api = createApi()
    const response = await api.put(`api/ProjectTask/${projectTaskId}/updateStatus?status=${status}`)
    return response.data
}

export async function searchProjectTasks(filters) {
  const api = createApi();

  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search)
  if (filters.status) params.append('status', filters.status)
  if (filters.startFrom) params.append('startFrom', filters.startFrom)
  if (filters.endTo) params.append('endTo', filters.endTo)
  if (filters.page) params.append('page', filters.page)
  if (filters.pageSize) params.append('pageSize', filters.pageSize)
  if (filters.userId) params.append('userId', filters.userId)

  const response = await api.get(`api/ProjectTask/search?${params.toString()}`);
  return response.data;
}

export async function editProjectTask(data) {
    const api = createApi()
    const response = await api.put(`api/ProjectTask/edit`, data)
    return response.data
}