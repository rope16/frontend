import { createApi } from './api'

export async function fetchUserTasks(pageNumber, pageSize) {
  const api = createApi();
  const response = await api.get(`UserTask/getUserTasks?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return response.data;
}

export async function createUserTask(projectTaskId, userId) {
  const api = createApi();
  const response = await api.post(`UserTask`, { projectTaskId: projectTaskId, userId: userId });
  return response.data;
}

export async function removeUserTask(userTaskId) {
  const api = createApi();
  const response = await api.delete(`UserTask/${userTaskId}`);
  return response.data;
}