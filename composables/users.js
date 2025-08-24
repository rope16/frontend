import { createApi } from "#imports";

export async function searchUsers(params) {
    const api = createApi();
    const response = await api.get(`api/user/searchUsers?query=${params.query ?? ''}&page=${params.page}&pageSize=${params.pageSize}`);
    return response.data;
}

export async function createUser(params) {
    const api = createApi();
    const response = await api.post('api/user/createUser', params);
    return response.data;
}

export async function updateUserRole(userId, role) {
    const api = createApi();
    const response = await api.put(`api/user/${userId}/updateUserRole?role=${role}`);
    return response.data;
}