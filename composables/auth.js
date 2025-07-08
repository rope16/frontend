import { createApi } from './api'

export async function loginUser(email, password) {
  const api = createApi()
  const response = await api.post('/login', { email, password })
  return response.data
}