'use server'

import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

export async function getCurrentUser() {
  try {
    const headers = await nextHeaders()
    const result = await payload.auth({ headers })
    const user = result.user
    if (!user) {
      throw new Error('User not found')
    }
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    return
  }
}