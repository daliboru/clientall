'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SpaceNavProps {
  spaceId: number | string
  isOwner?: boolean
}

export default function SpaceNav({ spaceId, isOwner }: SpaceNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Overview',
      path: `/spaces/${spaceId}`,
    },
    {
      name: 'Notes',
      path: `/spaces/${spaceId}/notes`,
    },
    {
      name: 'Resources',
      path: `/spaces/${spaceId}/resources`,
    },
    {
      name: 'Members',
      path: `/spaces/${spaceId}/members`,
    },
    {
      name: 'Settings',
      path: `/spaces/${spaceId}/settings`,
      ownerOnly: true,
    },
  ]

  const filteredNavItems = navItems.filter((item) => !item.ownerOnly || isOwner)

  return (
    <ScrollArea className="w-full">
      <nav className="flex gap-2 border-b min-w-max">
        {filteredNavItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <Button
              variant="ghost"
              className={cn(
                'relative h-9 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground hover:text-foreground whitespace-nowrap',
                pathname === item.path && 'border-primary text-foreground',
              )}
            >
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
