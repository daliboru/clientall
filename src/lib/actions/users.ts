'use server'

import { User } from '@/payload-types'
import { revalidatePath } from 'next/cache'
import { cookies as getCookies } from 'next/headers'
import { getServerAuth } from '../getServerAuth'
import { asManyRel, isMediaRel } from '../payload-utils'
import { memberInviteSchema } from '../validations/member'

export async function updateUser(formData: FormData) {
  const { user } = await getServerAuth()

  if (user) {
    const { name, avatar, calendly_url, removeAvatar } = extractFormData(formData)

    const mediaId = await handleAvatarUpdate({
      currentUser: user,
      newAvatar: avatar,
      removeAvatar,
      userName: name,
    })

    const updateUser = await updateUserProfile({
      userId: user.id,
      name,
      avatarId: mediaId,
      calendly_url,
    })

    revalidatePath('/dashboard')
    return updateUser
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
  const { payload } = await getServerAuth()

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
  const { payload } = await getServerAuth()

  const user = await payload.update({
    collection: 'users',
    id: userId,
    data: {
      name,
      avatar: avatarId,
      calendly_url: calendly_url || null, // Ensure empty string is saved as null
    },
  })
  return user
}

export async function deleteUser(userId: number) {
  try {
    const { payload } = await getServerAuth()

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

interface SignUpData {
  email: string
  name: string
  password: string
  confirmPassword: string
}

export async function signup(data: SignUpData) {
  try {
    const { payload } = await getServerAuth()
    const user = await payload.create({
      collection: 'users',
      data: {
        role: 'client',
        ...data,
      },
      disableVerificationEmail: true,
      showHiddenFields: true,
    })

    await payload.sendEmail({
      to: data.email,
      subject: 'Welcome to Tiny Portals - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6d28d9; text-align: center;">Welcome to Tiny Portals</h1>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Hi ${data.name},<br><br>
            Thank you for signing up! To start using Tiny Portals, please verify your email address by clicking the button below.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/verify?token=${user._verificationToken}&id=${user.id}"
               style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            If you didn't create an account with Tiny Portals, you can safely ignore this email.
          </p>
        </div>
      `,
    })

    return {
      success: true,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create account',
    }
  }
}

interface CompleteProfileData {
  token: string
  password: string
  name: string
}

export async function completeProfile(data: CompleteProfileData) {
  try {
    const { headers } = await getServerAuth()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/complete-profile`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: headers.get('cookie') || '',
        },
        body: JSON.stringify(data),
      },
    )

    const result = await response.json()

    if (result.success) {
      revalidatePath('/')
      return {
        success: true,
      }
    }

    return {
      success: false,
      error: result.error || 'Failed to complete profile',
    }
  } catch (error) {
    return {
      success: false,
      error: 'Something went wrong',
    }
  }
}

export async function addMember(email: string, spaceId: number) {
  try {
    const { headers } = await getServerAuth()

    const parse = memberInviteSchema.safeParse({ email })
    if (!parse.success) {
      return {
        success: false,
        error: 'Invalid email address',
      }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/invite-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: headers.get('cookie') || '',
      },
      body: JSON.stringify({ email: email.trim(), spaceId }),
    })

    const result = await response.json()

    if (result.success) {
      revalidatePath(`/spaces/${spaceId}`)
      return {
        success: true,
        isNewUser: !result.existingUser,
      }
    }

    return {
      success: false,
      errors: result.errors,
    }
  } catch (error) {
    return { success: false }
  }
}

export async function removeMember(memberId: number, spaceId: number) {
  try {
    const { user, payload } = await getServerAuth()

    const space = await payload.findByID({
      collection: 'spaces',
      id: spaceId,
      overrideAccess: false,
      user,
    })
    const existingMembers = space.members || []
    const newMemberId = memberId
    await payload.update({
      collection: 'spaces',
      id: spaceId,
      data: {
        members: asManyRel<User>(existingMembers).filter(
          (member: User) => member.id !== newMemberId,
        ),
      },
    })
    revalidatePath(`/spaces/${spaceId}/members`)
    return {
      success: true,
    }
  } catch (error) {
    return { success: false }
  }
}
