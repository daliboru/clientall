'use server'

import { revalidatePath } from 'next/cache'
import { getNotes } from '../functions/notes'
import { getServerAuth } from '../getServerAuth'

export async function createNote(content: string, spaceId: string) {
  const { user, payload } = await getServerAuth()

  await payload.create({
    collection: 'notes',
    data: {
      content,
      space: parseInt(spaceId),
    },
    req: {
      user,
    },
    overrideAccess: false,
  })

  const updatedNotes = await getNotes(spaceId, 1, 3) // Set limit to 3
  revalidatePath(`/spaces/${spaceId}`)
  return {
    message: 'Note created successfully',
    success: true,
    notes: updatedNotes,
  }
}

export async function deleteNote(noteId: number, spaceId: string, currentPage: number = 1) {
  try {
    const { payload, user } = await getServerAuth()

    await payload.delete({
      collection: 'notes',
      id: noteId,
      overrideAccess: false,
      user,
    })

    const updatedNotes = await getNotes(spaceId, currentPage)
    revalidatePath(`/spaces/${spaceId}`)

    return {
      message: 'Note deleted successfully',
      success: true,
      notes: updatedNotes,
    }
  } catch (error) {
    return { message: 'Error deleting note', success: false }
  }
}
