'use server'

import { asManyRel } from '@/lib/payload-utils'
import { memberInviteSchema } from '@/lib/validations/member'
import { User } from '@/payload-types'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

export async function addMember(email: string, spaceId: string) {
  try {
    const parse = memberInviteSchema.safeParse({ email })
    if (!parse.success) {
      return {
        success: false,
        error: 'Invalid email address',
      }
    }

    const headers = await nextHeaders()
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
      error: result.error || 'Failed to add member',
    }
  } catch (error) {
    return {
      success: false,
      error: 'Something went wrong',
    }
  }
}

export async function removeMember(memberId: number, spaceId: number) {
  try {
    const space = await payload.findByID({
      collection: 'spaces',
      id: spaceId,
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
