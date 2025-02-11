import { Space } from '@/payload-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from './use-toast'

interface UpdateSpaceData {
  name: string
  description?: string
}

interface SpaceResponse {
  doc: Space
  message: string
}

export function useUpdateSpace(spaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateSpaceData) => {
      const response = await fetch(`/api/spaces/${spaceId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update space')
      }

      return result
    },
    onSuccess: (response: SpaceResponse) => {
      // Update both caches immediately
      queryClient.setQueryData(['space', spaceId], response.doc)
      queryClient.invalidateQueries({
        queryKey: ['spaces'],
        refetchType: 'all',
      })

      toast({
        title: 'Settings updated',
        description: 'Your space settings have been updated successfully.',
        variant: 'success',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update space settings.',
        variant: 'destructive',
      })
    },
  })
}
