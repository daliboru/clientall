'use server'

import { spaceSettingsSchema, type SpaceSettingsForm } from '@/lib/validations/space'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

export async function getSpaces() {
  try {
    const headers = await nextHeaders()
    const result = await payload.auth({ headers })
    const user = result.user
    if (!user) {
      throw new Error('User not found')
    }
    const spaces = await payload.find({
      collection: 'spaces',
      where: {
        administrators: {
          equals: user.id,
        },
      },
    })
    return spaces.docs
  } catch (error) {
    console.error('Error fetching spaces:', error)
    return
  }
}

export async function getSpace(spaceId: string) {
  try {
    const space = await payload.findByID({
      collection: 'spaces',
      id: spaceId,
    })
    return space
  } catch (error) {
    console.error('Error fetching space:', error)
  }
}

export async function updateSpace(spaceId: string, data: SpaceSettingsForm) {
  try {
    const parse = spaceSettingsSchema.safeParse(data)

    if (!parse.success) {
      return {
        success: false,
        error: 'Invalid form data',
        errors: parse.error.flatten().fieldErrors,
      }
    }

    const validatedData = parse.data

    const result = await payload.update({
      collection: 'spaces',
      id: spaceId,
      data: validatedData,
    })

    revalidatePath(`/spaces/${spaceId}`)
    return {
      success: true,
      data: result,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update space',
    }
  }
}
