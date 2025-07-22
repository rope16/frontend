import { createApi } from './api'

export async function fetchStatistics() {
    const api = createApi()
    const response = await api.get('Statistics/getGeneralStats')
    return response.data
}
