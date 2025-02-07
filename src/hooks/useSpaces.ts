import { Space } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'

interface SpacesResponse {
  docs: Space[]
  hasNextPage: boolean
  nextPage: number
  prevPage: number
  totalDocs: number
  totalPages: number
}

export function useSpaces(userId?: string | number) {
  return useQuery<SpacesResponse>({
    queryKey: ['spaces', userId],
    queryFn: async () => {
      const response = await fetch(`/api/spaces?where[administrators][equals]=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch spaces')
      }
      return response.json()
    },
    enabled: !!userId,
  })
}
