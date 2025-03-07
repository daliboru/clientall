import { User } from '@/payload-types'
import type { SanitizedPermissions } from 'payload'

export type Login = (email: string, password: string) => Promise<User | undefined>
export type Logout = () => Promise<void>

export interface AuthContext {
  permissions?: null | SanitizedPermissions
  setPermissions: (permissions: null | SanitizedPermissions) => void
  setUser: (user: null | User) => void
  user?: null | User
  login: Login
  logout: Logout
}
