import { useRouter } from 'vue-router'

export function useNavigation() {
  const router = useRouter()

  const goToUserProfile = (userId) => {
    if (!userId) return
    router.push({ name: 'profile-userId', params: { userId: userId } })
  }

  const goToHome = () => {
    router.push({ name: 'index' })
  }

  const goToLogin = () => {
    router.push({ name: 'login' })
  }

  const goToProject = (projectId) => {
    if (!projectId) return
    router.push({ name: 'project-projectId', params: { projectId: projectId } })
  }

  const goToProjectsPage = () => {
    router.push({ name: 'projects' })
  }

  const goToUsersPage = () => {
    router.push({ name: 'users' })
  }

  const goToProjectTaskPage = (projectTaskId) => {
    if (!projectTaskId) return
    router.push({ name: 'projectTask-projectTaskId', params: { projectTaskId: projectTaskId } })
  }

  const goToProjectTasksPage = () => {
    router.push({ name: 'projectTasks' })
  }

  return {
    goToUserProfile,
    goToHome,
    goToLogin,
    goToProject,
    goToProjectsPage,
    goToUsersPage,
    goToProjectTaskPage,
    goToProjectTasksPage
  }
}