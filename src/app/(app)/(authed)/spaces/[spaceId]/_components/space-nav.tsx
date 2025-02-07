'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SpaceNavProps {
  spaceId: number | string
}

export default function SpaceNav({ spaceId }: SpaceNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Overview',
      path: `/spaces/${spaceId}`,
    },
    {
      name: 'Members',
      path: `/spaces/${spaceId}/members`,
    },
    {
      name: 'Settings',
      path: `/spaces/${spaceId}/settings`,
    },
  ]

  return (
    <nav className="flex gap-2 border-b">
      {navItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <Button
            variant="ghost"
            className={cn(
              'relative h-9 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground hover:text-foreground',
              pathname === item.path && 'border-primary text-foreground',
            )}
          >
            {item.name}
          </Button>
        </Link>
      ))}
    </nav>
  )
}
