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
      const cookies = await getCookies()
      cookies.delete('payload-token')
      revalidatePath('/')
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
        sameSite: 'lax',
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      })

      // Ensure path is revalidated before redirect
      revalidatePath('/', 'layout')
    }

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

interface SignUpData {
  email: string
  name: string
  password: string
  confirmPassword: string
}

export async function signup(data: SignUpData) {
  try {
    await payload.create({
      collection: 'users',
      data: {
        role: 'client',
        ...data,
      },
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
    const headers = await nextHeaders()

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
