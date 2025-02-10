import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from '../payload-types'
import { toast } from './use-toast'

export function useUpdateUser(user?: Partial<User>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const rawFormData = {
        name: formData.get('name'),
      }

      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rawFormData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update user')
      }

      if (!result || !result.doc) {
        throw new Error('Invalid response from server')
      }

      return result.doc
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      toast({
        title: 'Settings updated',
        description: 'Your profile has been updated successfully.',
        variant: 'success',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile settings.',
        variant: 'destructive',
      })
    },
  })
}
