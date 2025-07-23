import { createApi } from './api'

export async function fetchUserTasks(pageNumber, pageSize) {
  const api = createApi();
  const response = await api.get(`UserTask/getUserTasks?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return response.data;
}