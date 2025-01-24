import { User } from '../../../payload-types'
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

      if (!result.ok) {
        throw new Error('Login failed')
      }

      const json = await result.json()

      return {
        user: json.user,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`External login failed: ${error.message}`)
      } else {
        throw new Error('External login failed')
      }
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
