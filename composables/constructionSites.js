import { createApi } from './api'

export async function fetchConstructionSites() {
	const api = createApi()
	const response = await api.get('getAllConstructionSites')
	return response.data
}

export async function searchConstructionSites(params) {
	const api = createApi()

	const queryParams = new URLSearchParams()
	if (params.query) queryParams.append('search', params.query)
	if (params.page) queryParams.append('page', params.page)
	if (params.pageSize) queryParams.append('pageSize', params.pageSize)

	const response = await api.get(`api/ConstructionSite/search?${queryParams.toString()}`)
	return response.data
}

export async function createConstructionSite(params) {
	const api = createApi()
	const response = await api.post('api/ConstructionSite/createConstructionSite', params)
	return response.data
}

export async function updateConstructionSite(params) {
	const api = createApi();
	const response = await api.put(`api/ConstructionSite/${params.constructionSiteId}/editConstructionSite`, params)
	return response.data
}


