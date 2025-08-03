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
    router.push({ name: 'project-id', params: { projectId: projectId } })
  }

  return {
    goToUserProfile,
    goToHome,
    goToLogin,
    goToProject,
  }
}