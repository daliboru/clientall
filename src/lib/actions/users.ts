'use server'

import { profileSettingsSchema } from '@/lib/validations/user-settings'
import { Media, User } from '@/payload-types'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { isMediaRel } from '../payload-utils'

const payload = await getPayload({ config })

export async function updateUser(formData: FormData) {
  const headers = await nextHeaders()
  const { name, avatar } = extractFormData(formData)
  const removeAvatar = formData.get('removeAvatar') === 'true'

  const validationResult = validateUserData(name)
  if (!validationResult.success) {
    return validationResult
  }

  try {
    const user = await authenticateUser(headers)
    let media: Media | undefined

    // Handle avatar removal
    if (removeAvatar) {
      if (isMediaRel(user.avatar)) {
        await payload.delete({
          collection: 'media',
          id: user.avatar.id,
        })
      }
      media = undefined
    } else if (avatar) {
      // Handle new avatar upload
      media = await uploadAvatar(avatar, name, user)
    }

    await updateUserProfile(user.id, name, media?.id)
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.log('Error updating user:', error.message)
    return { success: false, error: 'Failed to update user' }
  }
}

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

async function uploadAvatar(avatar: File, name: string, user: User): Promise<Media> {
  try {
    const arrayBuffer = await avatar.arrayBuffer()
    const avatarBuffer = Buffer.from(arrayBuffer)

    const oldAvatarId = isMediaRel(user.avatar) ? user.avatar.id : undefined
    if (oldAvatarId) {
      await payload.delete({
        collection: 'media',
        id: oldAvatarId,
      })
    }

    return await payload.create({
      collection: 'media',
      data: { alt: name },
      file: {
        mimetype: avatar.type,
        data: avatarBuffer,
        size: avatarBuffer.byteLength,
        name: `${avatar.name}-avatar`,
      },
    })
  } catch (error: any) {
    console.log('Error uploading avatar:', error.message)
    throw new Error('Failed to upload avatar')
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
