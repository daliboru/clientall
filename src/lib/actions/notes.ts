'use server'

import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

export async function getNotes(spaceId?: number | string, page: number = 1, limit: number = 3) {
  if (!spaceId) return
  const notes = await payload.find({
    collection: 'notes',
    where: {
      space: {
        equals: spaceId,
      },
    },
    page,
    limit,
    sort: '-createdAt',
  })
  return notes
}

export async function createNote(content: string, spaceId: string) {
  const headers = await nextHeaders()
  const result = await payload.auth({ headers })
  const user = result.user

  await payload.create({
    collection: 'notes',
    data: {
      content,
      space: parseInt(spaceId),
    },
    req: {
      user,
    },
  })

  const updatedNotes = await getNotes(spaceId, 1, 3) // Set limit to 3
  revalidatePath(`/spaces/${spaceId}`)
  return { 
    message: 'Note created successfully', 
    success: true,
    notes: updatedNotes 
  }
}

export async function deleteNote(noteId: number, spaceId: string, currentPage: number = 1) {
  try {
    await payload.delete({
      collection: 'notes',
      id: noteId,
    })
    
    const updatedNotes = await getNotes(spaceId, currentPage)
    revalidatePath(`/spaces/${spaceId}`)
    
    return { 
      message: 'Note deleted successfully', 
      success: true,
      notes: updatedNotes
    }
  } catch (error) {
    return { message: 'Error deleting note', success: false }
  }
}
