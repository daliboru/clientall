'use client'

import { User } from '@/payload-types'
import { SanitizedPermissions } from 'payload'
import { createContext, useContext, useEffect, useState } from 'react'
import { serverChangePassword } from '../../../../lib/actions/users'
import {
  PasswordSettingsFormValues,
  passwordSettingsSchema,
} from '../../../../lib/validations/user-settings'
import { rest } from './rest'
import { AuthContext, ChangePassword, ForgotPassword, Login, Logout, ResetPassword } from './types'

const Context = createContext({} as AuthContext)

export const AuthProvider: React.FC<{
  api?: 'rest'
  children: React.ReactNode
}> = ({ api = 'rest', children }) => {
  const [user, setUser] = useState<null | User>(null)
  const [permissions, setPermissions] = useState<null | SanitizedPermissions>(null)

  const login: Login = async (email: string, password: string): Promise<User> => {
    if (api === 'rest') {
      try {
        const user = await rest<User>(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
          email,
          password,
        })

        if (!user) {
          throw new Error('Login failed - no user returned')
        }

        setUser(user)
        return user
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Authentication failed')
      }
    }
    throw new Error('Unsupported API method')
  }

  const logout: Logout = async () => {
    if (api === 'rest') {
      await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`)
      setUser(null)
      return
    }
  }

  useEffect(() => {
    const fetchMe = async () => {
      if (api === 'rest') {
        const user = await rest<User>(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
          {},
          { method: 'GET' },
        )
        setUser(user)
      }
    }
    void fetchMe()
  }, [api])

  const forgotPassword: ForgotPassword = async (email: string) => {
    if (api === 'rest') {
      await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`, {
        email,
      })
    }
  }

  const resetPassword: ResetPassword = async (token: string, password: string) => {
    if (api === 'rest') {
      try {
        const user = await rest<User>(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`,
          {
            token,
            password,
          },
        )

        if (!user) {
          throw new Error('Failed to reset password')
        }

        setUser(user)
        return user
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to reset password')
      }
    }
  }

  const changePassword: ChangePassword = async (data: PasswordSettingsFormValues) => {
    if (user) {
      if (api === 'rest') {
        const parse = passwordSettingsSchema.safeParse({
          current: data.current,
          new: data.new,
          confirm: data.confirm,
        })

        if (!parse.success) {
          throw new Error(parse.error.message)
        }

        try {
          const loginResponse = await rest<User>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`,
            {
              email: user.email,
              password: data.current,
            },
          )

          if (!loginResponse) {
            throw new Error('Current password is incorrect')
          }

          const userWithChangedPassword = await serverChangePassword(data.new)
          if (!userWithChangedPassword) {
            throw new Error('Failed to change password')
          }
          setUser(userWithChangedPassword)
          return userWithChangedPassword
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Failed to change the password.')
        }
      }
    }
  }

  return (
    <Context.Provider
      value={{
        login,
        logout,
        permissions,
        setPermissions,
        forgotPassword,
        resetPassword,
        changePassword,
        setUser,
        user,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseAuth<T = User> = () => AuthContext

export const useAuth: UseAuth = () => useContext(Context)
