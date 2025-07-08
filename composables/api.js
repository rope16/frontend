import axios from 'axios'

export function createApi() {
  return axios.create({
    baseURL: 'https://localhost:7104',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}