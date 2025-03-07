'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/app/(app)/_components/ui/avatar'
import { Button } from '@/app/(app)/_components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/(app)/_components/ui/dropdown-menu'
import { isMediaRel } from '@/lib/payload-utils'
import { getInitials } from '@/lib/utils'
import { User } from '@/payload-types'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useAuth } from '../../_providers/Auth'

type Props = {
  user: User
}

const Nav: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const { logout } = useAuth()
  const [notifications] = useState([
    {
      id: 1,
      title: 'New Document Added',
      description: 'Project Brief.pdf was added to Marketing Campaign',
      time: '2 hours ago',
    },
    {
      id: 2,
      title: 'New Note Added',
      description: 'John added a note to Product Launch',
      time: '5 hours ago',
    },
  ])

  const onLogout = async () => {
    try {
      await logout()
      router.replace('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <nav className="w-full flex justify-center py-4 bg-purple-600">
      <div className="w-full max-w-7xl flex justify-between px-4 items-center">
        <Link href="/dashboard">
          <div className="text-white/90 capitalize font-bold">Tiny Portals</div>
        </Link>
        <ul className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative text-white hover:text-white hover:bg-purple-700/50"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-3">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-muted-foreground">{notification.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
            onClick={onLogout}
          >
            Logout
          </Button>
        </ul>
      </div>
    </nav>
  )
}

export default Nav
