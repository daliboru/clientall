import { User } from '../../../payload-types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
}
