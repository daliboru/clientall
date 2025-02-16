'use server'

import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { cookies as getCookies, headers as nextHeaders } from 'next/headers'
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

export async function login(email: string, password: string) {
  try {
    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    if (result.token) {
      const cookies = await getCookies()
      cookies.set('payload-token', result.token, {
        httpOnly: true,
        secure: true,
        path: '/',
      })
    }

    revalidatePath('/')
    return {
      success: true,
      message: 'Login successful',
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export async function logout() {
  await fetch('http://localhost:3000/api/[collection-slug]/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
