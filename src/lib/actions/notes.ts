'use server'

import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
export async function getNotes(spaceId?: number | string) {
  if (!spaceId) return
  const notes = await payload.find({
    collection: 'notes',
    where: {
      space: {
        equals: spaceId,
      },
    },
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

  revalidatePath(`/spaces/${spaceId}`)
  return { message: 'User updated successfully', success: true }
}

export async function deleteNote(noteId: number, spaceId: string) {
  try {
    await payload.delete({
      collection: 'notes',
      id: noteId,
    })
    revalidatePath(`/spaces/${spaceId}`)
    return { message: 'Note deleted successfully', success: true }
  } catch (error) {
    return { message: 'Error deleting note', success: false }
  }
}
