import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from './use-toast'

export function useDeleteUser() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/users/me', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['currentUser'] })
      router.push('/login')
      toast({
        title: 'Account deleted',
        description: 'Your account has been permanently deleted.',
        variant: 'default',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete account. Please try again.',
        variant: 'destructive',
      })
    },
  })
}