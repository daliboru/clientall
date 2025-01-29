import { authService } from '@/lib/services/auth/authService'
import { useQuery } from '@tanstack/react-query'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 1,
  })
}
