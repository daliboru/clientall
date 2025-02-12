'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { isMediaRel } from '@/lib/payload-utils'
import { User } from '@/payload-types'
import Link from 'next/link'
import React from 'react'
import { logoutAction } from './action'

type Props = {
  user: User
}

const Nav: React.FC<Props> = ({ user }) => {
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
        <div className="text-white/90 capitalize font-medium">{`${user?.role || 'User'} view`}</div>
        <ul className="flex gap-2 items-center">
          <Link href="/user-settings">
            <Avatar className="h-8 w-8 border-2 border-white/20">
              <AvatarImage
                src={isMediaRel(user?.avatar) ? user.avatar.url : undefined}
                alt={user?.name}
              />
              <AvatarFallback className="bg-purple-700 text-white">
                {user?.name ? getInitials(user.name) : '??'}
              </AvatarFallback>
            </Avatar>
          </Link>

          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-purple-700/50"
            onClick={logoutAction}
          >
            Logout
          </Button>
        </ul>
      </div>
    </nav>
  )
}

export default Nav
