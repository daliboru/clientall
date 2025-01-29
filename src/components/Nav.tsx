'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useLogout } from '../hooks/useLogout'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

const Nav: React.FC = () => {
  const { logout } = useLogout()
  const { data: user, isLoading } = useCurrentUser()

  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <nav className="w-full flex justify-center py-4 bg-purple-600">
      <div className="w-full max-w-7xl flex justify-between px-4 items-center">
        <div className="text-white/90 capitalize font-medium">
          {isLoading ? (
            <Skeleton className="h-6 w-24 bg-purple-500" />
          ) : (
            `${user?.role || 'User'} view`
          )}
        </div>
        <ul className="flex gap-2 items-center">
          {isLoading ? (
            <Skeleton className="h-8 w-8 rounded-full bg-purple-500" />
          ) : (
            <Avatar className="h-8 w-8 border-2 border-white/20">
              <AvatarImage src={user?.avatar?.url} alt={user?.name || ''} />
              <AvatarFallback className="bg-purple-700 text-white">
                {user?.name ? getInitials(user.name) : '??'}
              </AvatarFallback>
            </Avatar>
          )}
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-purple-700/50"
            onClick={logout}
            disabled={isLoading}
          >
            Logout
          </Button>
        </ul>
      </div>
    </nav>
  )
}

export default Nav
