import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from '../payload-types'
import { toast } from './use-toast'

export function useUpdateUser(user?: Partial<User>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        body: data,
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      toast({
        title: 'Settings updated',
        description: 'Your profile has been updated successfully.',
        variant: 'success',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update profile settings.',
        variant: 'destructive',
      })
    },
  })
}
