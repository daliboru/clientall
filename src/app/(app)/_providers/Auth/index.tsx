'use client'

import { User } from '@/payload-types'
import { SanitizedPermissions } from 'payload'
import { createContext, useContext, useEffect, useState } from 'react'
import { rest } from './rest'
import { AuthContext, Login, Logout } from './types'

const Context = createContext({} as AuthContext)

export const AuthProvider: React.FC<{
  api?: 'rest'
  children: React.ReactNode
}> = ({ api = 'rest', children }) => {
  const [user, setUser] = useState<null | User>()
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
        setUser(user || null)
      }
    }
    void fetchMe()
  }, [api])

  return (
    <Context.Provider
      value={{
        login,
        logout,
        permissions,
        setPermissions,
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
