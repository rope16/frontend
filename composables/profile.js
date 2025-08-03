import { createApi } from './api'

export async function fetchProfile(userId) {
    const api = createApi()
    const response = await api.get(`api/user/${userId}/getProfile`)
    return response.data
}