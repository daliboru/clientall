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

interface SignUpData {
  email: string
  name: string
  password: string
  confirmPassword: string
}

export async function signup(data: SignUpData) {
  try {
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
