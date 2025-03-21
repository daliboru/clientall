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
import { Bell, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '../../_providers/Auth'

export default function Nav() {
  const router = useRouter()
  const { logout, user } = useAuth()
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
      // Still redirect to login page even if there's an error
      router.replace('/login')
    }
  }

  return (
    <nav className="w-full flex justify-center py-4 bg-primary">
      <div className="w-full max-w-7xl flex justify-between px-4 items-center">
        <Link href="/dashboard">
          <div className="text-primary-foreground/90 capitalize font-bold">Tiny Portals</div>
        </Link>
        <ul className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative text-primary-foreground hover:text-primary-foreground hover:bg-primary/90/50"
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 border-2 border-white/20 cursor-pointer hover:opacity-90">
                <AvatarImage
                  src={isMediaRel(user?.avatar) ? user.avatar.url : undefined}
                  alt={user?.name}
                />
                <AvatarFallback className="bg-purple-700 text-primary-foreground">
                  {user?.name ? getInitials(user.name) : '??'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] sm:w-56">
              <div className="px-2 py-1.5 hidden sm:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuItem asChild className="flex items-center gap-2 py-2">
                <Link href="/user-settings" className="cursor-pointer">
                  <Settings className="h-4 w-4" />
                  <span>Profile Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onLogout}
                className="flex items-center gap-2 py-2 cursor-pointer text-red-600 dark:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ul>
      </div>
    </nav>
  )
}
