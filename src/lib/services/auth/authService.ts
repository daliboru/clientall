import { User } from '@/payload-types'
import { AuthResponse, LoginCredentials } from './types'

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const result = await fetch('/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const json = await result.json()

      if (!result.ok) {
        // Extract error message from the API response
        const errorMessage = json.errors?.[0]?.message || 'Login failed'
        throw new Error(errorMessage)
      }

      return {
        user: json.user,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred')
    }
  }

  // Logout method
  async logout(): Promise<void> {
    await fetch('/api/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const res = await fetch('/api/users/me', {
      credentials: 'include',
    })

    const json = await res.json()

    return json.user
  }
}

export const authService = new AuthService()
