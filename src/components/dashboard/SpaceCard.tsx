'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { asManyRel, isMediaRel } from '@/lib/payload-utils'
import { Space, User } from '@/payload-types'
import Link from 'next/link'

interface SpaceCardProps {
  space: Space
}

export function SpaceCard({ space }: SpaceCardProps) {
  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <Link href={`/spaces/${space.id}`}>
      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
        <CardHeader>
          <CardTitle>{space.name}</CardTitle>
          <CardDescription>{space.description || 'No description available'}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <div className="flex -space-x-2">
            {asManyRel<User>(space.administrators)
              .slice(0, 3)
              .map((user) => (
                <Avatar key={user.id} className="border-2 border-background h-8 w-8">
                  <AvatarImage
                    src={isMediaRel(user.avatar) ? user.avatar.url : undefined}
                    alt={user.name}
                  />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              ))}
            {(space.administrators?.length ?? 0) > 3 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                +{space.administrators!.length - 3}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
