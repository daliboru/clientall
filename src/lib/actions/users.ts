'use server'

import { profileSettingsSchema } from '@/lib/validations/user-settings'
import { User } from '@/payload-types'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { cookies as getCookies } from 'next/headers'
import { getPayload } from 'payload'
import { isMediaRel } from '../payload-utils'
import { getCurrentUser } from './auth'

const payload = await getPayload({ config })

export async function getUserById(id?: number) {
  if (!id) {
    return null
  }
  const user = await payload.findByID({
    collection: 'users',
    id,
    depth: 0,
  })
  return user
}

export async function updateUser(formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    const { name, avatar, calendly_url, removeAvatar } = extractFormData(formData)
    const validationResult = validateUserData({ name, calendly_url })
    if (!validationResult.success) {
      return validationResult
    }

    const mediaId = await handleAvatarUpdate({
      currentUser: user,
      newAvatar: avatar,
      removeAvatar,
      userName: name,
    })

    await updateUserProfile({
      userId: user.id,
      name,
      avatarId: mediaId,
      calendly_url,
    })

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: 'Failed to update user' }
  }
}

function extractFormData(formData: FormData) {
  return {
    name: formData.get('name') as string,
    avatar: formData.get('avatar') as File | null,
    calendly_url: formData.get('calendly_url') as string,
    removeAvatar: formData.get('removeAvatar') === 'true',
  }
}

function validateUserData({ name, calendly_url }: { name: string; calendly_url?: string }) {
  const parse = profileSettingsSchema.safeParse({ name, calendly_url })

  if (!parse.success) {
    return {
      success: false,
      error: 'Invalid form data',
      errors: parse.error.flatten().fieldErrors,
    }
  }

  return parse
}

async function handleAvatarUpdate({
  currentUser,
  newAvatar,
  removeAvatar,
  userName,
}: {
  currentUser: User
  newAvatar: File | null
  removeAvatar: boolean
  userName: string
}) {
  // Handle avatar removal
  if (removeAvatar) {
    if (isMediaRel(currentUser.avatar)) {
      await payload.delete({
        collection: 'media',
        id: currentUser.avatar.id,
      })
    }
    return undefined
  }

  // Handle new avatar upload
  if (newAvatar) {
    const arrayBuffer = await newAvatar.arrayBuffer()
    const avatarBuffer = Buffer.from(arrayBuffer)

    // Delete old avatar if exists
    if (isMediaRel(currentUser.avatar)) {
      await payload.delete({
        collection: 'media',
        id: currentUser.avatar.id,
      })
    }

    const media = await payload.create({
      collection: 'media',
      data: { alt: userName },
      file: {
        mimetype: newAvatar.type,
        data: avatarBuffer,
        size: avatarBuffer.byteLength,
        name: newAvatar.name,
      },
    })

    return media.id
  }

  return undefined
}

async function updateUserProfile({
  userId,
  name,
  avatarId,
  calendly_url,
}: {
  userId: number
  name: string
  avatarId?: number
  calendly_url?: string
}) {
  await payload.update({
    collection: 'users',
    id: userId,
    data: {
      name,
      avatar: avatarId,
      calendly_url: calendly_url || null, // Ensure empty string is saved as null
    },
  })
}

export async function deleteUser(userId: number) {
  try {
    await payload.delete({
      collection: 'users',
      id: userId,
    })

    const cookies = await getCookies()
    cookies.delete('payload-token')

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
