import axios from 'axios'

export function createApi() {
  const instance = axios.create({
    baseURL: 'https://localhost:7104',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Dodavanje tokena iz localStorage ako postoji
  instance.interceptors.request.use((config) => {
    const authData = localStorage.getItem('auth')
    if (authData) {
      try {
        const { token } = JSON.parse(authData)
        const {user} = JSON.parse(authData)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
          config.headers['userId'] = user.userId
        }
      } catch (e) {
        console.warn('Neispravan auth token u localStorage-u', e)
      }
    }
    return config
  })

  return instance
}