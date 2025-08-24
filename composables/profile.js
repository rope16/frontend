import { createApi } from './api'

export async function fetchProfile(userId) {
    const api = createApi()
    const response = await api.get(`api/user/${userId}/getProfile`)
    return response.data
}

export async function updateProfile(userId, profileData) {
    const api = createApi()
    const response = await api.put(`api/user/${userId}/editUser`, profileData)
    return response.data
}