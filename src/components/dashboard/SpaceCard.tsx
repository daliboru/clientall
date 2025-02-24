'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { asManyRel, isMediaRel } from '@/lib/payload-utils'
import { Space, User } from '@/payload-types'
import { ImageIcon, Badge as LucideBadge } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface SpaceCardProps {
  space: Space
  isOwner: boolean
}

export function SpaceCard({ space, isOwner }: SpaceCardProps) {
  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <Link href={`/spaces/${space.id}`}>
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg border flex items-center justify-center bg-muted">
              {isMediaRel(space.logo) ? (
                <Image
                  src={space.logo.url}
                  alt={space.logo.alt}
                  className="h-full w-full object-cover rounded-lg"
                  width={100}
                  height={100}
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="flex items-center justify-between">
                {space.name}
                <div className="flex gap-2">
                  {isOwner && (
                    <Badge variant="secondary">
                      <LucideBadge className="h-3 w-3 mr-1" />
                      Owner
                    </Badge>
                  )}
                </div>
              </CardTitle>
              <CardDescription className="mt-1.5">{space.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="justify-end">
          <div className="flex -space-x-2">
            {asManyRel<User>(space.members)
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
            {(space.members?.length ?? 0) > 3 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                +{space.members!.length - 3}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
