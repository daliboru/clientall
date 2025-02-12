'use server'

import { profileSettingsSchema } from '@/lib/validations/user-settings'
import { Media } from '@/payload-types'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

export async function updateUser(formData: FormData) {
  // Extract and validate form data
  const headers = await nextHeaders()
  const { name, avatar } = extractFormData(formData)

  const validationResult = validateUserData(name)
  if (!validationResult.success) {
    return validationResult
  }

  try {
    // Handle avatar upload if present
    const media = avatar ? await uploadAvatar(avatar, name) : undefined

    // Authenticate and get user
    const user = await authenticateUser(headers)

    // Update user profile
    await updateUserProfile(user.id, name, media?.id)

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Helper functions
function extractFormData(formData: FormData) {
  return {
    name: formData.get('name') as string,
    avatar: formData.get('avatar') as File | null,
  }
}

function validateUserData(name: string) {
  const parse = profileSettingsSchema.safeParse({ name })

  if (!parse.success) {
    return {
      success: false,
      error: 'Invalid form data',
      errors: parse.error.flatten().fieldErrors,
    }
  }

  return parse
}

async function uploadAvatar(avatar: File, name: string): Promise<Media> {
  const arrayBuffer = await avatar.arrayBuffer()
  const avatarBuffer = Buffer.from(arrayBuffer)

  try {
    return await payload.create({
      collection: 'media',
      data: { alt: name },
      file: {
        mimetype: avatar.type,
        data: avatarBuffer,
        size: avatarBuffer.byteLength,
        name: `${name.toLowerCase().replace(/\s+/g, '-')}-avatar`,
      },
    })
  } catch (error: any) {
    throw new Error(error.message)
  }
}

async function authenticateUser(headers: Headers) {
  const result = await payload.auth({ headers })
  const user = result.user

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

async function updateUserProfile(userId: number, name: string, avatarId?: number) {
  await payload.update({
    collection: 'users',
    id: userId,
    data: { name, avatar: avatarId },
  })
}

export async function deleteUser(userId: number) {
  try {
    await payload.delete({
      collection: 'users',
      id: userId,
    })
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
