'use server'

import { spaceSettingsSchema, type SpaceSettingsForm } from '@/lib/validations/space'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { isMediaRel } from '../payload-utils'
import { getCurrentUser } from './auth'

const payload = await getPayload({ config })

export async function getSpaces() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('User not found')
    }

    const spaces = await payload.find({
      collection: 'spaces',
      overrideAccess: false,
      user,
    })
    return spaces.docs
  } catch (error) {
    console.error('Error fetching spaces:', error)
    return
  }
}

export async function getSpace(spaceId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('User not found')
    }

    const space = await payload.findByID({
      collection: 'spaces',
      id: spaceId,
      user,
      overrideAccess: false,
    })
    return space
  } catch (error) {
    console.error('Error fetching space:', error)
  }
}

export async function updateSpace(spaceId: string, formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error('User not found')
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const logo = formData.get('logo') as File | null
    const removeLogo = formData.get('removeLogo') === 'true'

    const validationResult = spaceSettingsSchema.safeParse({ name, description })
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Invalid form data',
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const space = await payload.findByID({
      collection: 'spaces',
      id: spaceId,
      depth: 1,
      overrideAccess: false,
      user,
    })

    let logoId: number | undefined | null = undefined

    if (removeLogo) {
      if (isMediaRel(space.logo)) {
        await payload.delete({
          collection: 'media',
          id: space.logo.id,
        })
      }
      logoId = null
    } else if (logo) {
      const arrayBuffer = await logo.arrayBuffer()
      const logoBuffer = Buffer.from(arrayBuffer)

      if (isMediaRel(space.logo)) {
        await payload.delete({
          collection: 'media',
          id: space.logo.id,
        })
      }

      const media = await payload.create({
        collection: 'media',
        data: { alt: name },
        file: {
          mimetype: logo.type,
          data: logoBuffer,
          size: logoBuffer.byteLength,
          name: logo.name,
        },
      })

      logoId = media.id
    }

    await payload.update({
      collection: 'spaces',
      id: spaceId,
      data: {
        name,
        description,
        ...(logoId !== undefined && { logo: logoId }),
      },
    })

    revalidatePath(`/spaces/${spaceId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error updating space:', error)
    return { success: false, error: error.message }
  }
}

export async function createSpace(data: SpaceSettingsForm) {
  try {
    const parse = spaceSettingsSchema.safeParse(data)

    if (!parse.success) {
      return {
        success: false,
        error: 'Invalid form data',
        errors: parse.error.flatten().fieldErrors,
      }
    }

    const headers = await nextHeaders()
    const auth = await payload.auth({ headers })

    if (!auth.user) {
      throw new Error('Not authenticated')
    }

    const { name, description } = parse.data

    await payload.create({
      collection: 'spaces',
      data: {
        name,
        description,
        owner: auth.user.id,
        members: [auth.user.id],
      },
    })

    revalidatePath('/dashboard')

    return {
      success: true,
      message: 'Space created successfully',
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create space',
    }
  }
}

export async function deleteSpace(spaceId: string) {
  try {
    const user = await getCurrentUser()
    await payload.delete({
      collection: 'spaces',
      id: spaceId,
      user,
      overrideAccess: false,
    })
    revalidatePath('/dashboard')
    return {
      success: true,
      message: 'Space deleted successfully',
    }
  } catch (error: any) {
    console.log(error)
  }
}
