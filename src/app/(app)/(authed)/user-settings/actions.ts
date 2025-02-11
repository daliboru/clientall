'use server'

import { profileSettingsSchema } from '@/lib/validations/user-settings'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

export async function updateUserAction(formData: FormData) {
  const headers = await nextHeaders()

  try {
    const result = await payload.auth({ headers })
    const user = result.user
    if (!user) {
      throw new Error('User not found')
    }

    const rawFormData = {
      name: formData.get('name'),
    }

    const parse = profileSettingsSchema.safeParse(rawFormData)

    if (!parse.success) {
      return { message: 'Failed to create todo' }
    }

    const data = parse.data

    await payload.update({
      collection: 'users',
      id: user.id,
      data,
    })

    revalidatePath('/user-settings')
    return { message: 'User updated successfully', success: true }
  } catch (error) {
    return { message: error }
  }
}
