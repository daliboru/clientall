import { authService } from '@/lib/services/auth/authService'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const logout = async () => {
    try {
      await authService.logout()
      queryClient.removeQueries({ queryKey: ['currentUser'] })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return { logout }
}
