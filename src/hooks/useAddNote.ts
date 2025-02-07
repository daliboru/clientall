import { toast } from '@/hooks/use-toast'
import { Note } from '@/payload-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface AddNoteData {
  content: string
  space: string | number // allow both string and number types
}

interface NoteResponse {
  doc: Note
  message: string
}

export function useAddNote(spaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AddNoteData) => {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: data.content,
          space: Number(data.space), // Convert spaceId to number
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to add note')
      }

      return response.json()
    },
    onSuccess: (response: NoteResponse) => {
      queryClient.invalidateQueries({ queryKey: ['space-notes', spaceId] })
      toast({
        title: 'Note added',
        description: 'Your note has been added successfully.',
        variant: 'success',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add note. Please try again.',
        variant: 'destructive',
      })
    },
  })
}
