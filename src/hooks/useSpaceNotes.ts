import { Note } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'

export function useSpaceNotes(spaceId: string) {
  return useQuery<{ docs: Note[] }>({
    queryKey: ['space-notes', spaceId],
    queryFn: async () => {
      const response = await fetch(`/api/notes?where[space][equals]=${spaceId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      return response.json()
    },
  })
}