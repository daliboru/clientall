import { Space } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { notFound } from 'next/navigation'

export function useSpace(spaceId: string) {
  return useQuery<Space>({
    queryKey: ['space', spaceId],
    queryFn: async () => {
      const response = await fetch(`/api/spaces/${spaceId}`)
      if (!response.ok) {
        if (response.status === 404) {
          notFound()
        }
        throw new Error('Failed to fetch space')
      }
      return response.json()
    },
  })
}