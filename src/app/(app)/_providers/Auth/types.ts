import { User } from '@/payload-types'
import type { SanitizedPermissions } from 'payload'
import { PasswordSettingsFormValues } from '../../../../lib/validations/user-settings'

export type Login = (email: string, password: string) => Promise<User | undefined>
export type Logout = () => Promise<void>
export type ForgotPassword = (email: string) => Promise<void>
export type ResetPassword = (token: string, password: string) => Promise<User | undefined>
export type ChangePassword = (data: PasswordSettingsFormValues) => Promise<User | undefined>

export interface AuthContext {
  permissions?: null | SanitizedPermissions
  setPermissions: (permissions: null | SanitizedPermissions) => void
  setUser: (user: null | User) => void
  user?: null | User
  login: Login
  logout: Logout
  forgotPassword: ForgotPassword
  resetPassword: ResetPassword
  changePassword: ChangePassword
}
