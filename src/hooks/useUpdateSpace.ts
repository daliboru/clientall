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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update space')
      }

      return response.json()
    },
    onSuccess: (response: SpaceResponse) => {
      queryClient.setQueryData(['space', spaceId], response.doc)
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
