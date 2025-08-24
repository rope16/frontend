import { useAuthStore } from '@/stores/auth'

export function isAdmin() {
  const authStore = useAuthStore()
  return authStore.user?.role === 'Admin'
}

export function isUser() {
  const authStore = useAuthStore()
  return authStore.user?.role === 'User'
}