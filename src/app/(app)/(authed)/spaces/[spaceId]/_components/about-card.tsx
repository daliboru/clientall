'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { asManyRel, isMediaRel } from '@/lib/payload-utils'
import { getInitials } from '@/lib/utils'
import { Space, User } from '@/payload-types'

interface AboutCardProps {
  space: Space
  isLoading: boolean
}

export function AboutCard({ space, isLoading }: AboutCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-[150px] mb-2" />
          <Skeleton className="h-5 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-[100px] mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About this space</CardTitle>
        <CardDescription className="whitespace-pre-line">{space.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="text-sm font-medium mb-2">Administrators</h3>
          <div className="flex flex-wrap gap-2">
            {asManyRel<User>(space.administrators).map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={isMediaRel(user.avatar) ? user.avatar.url : undefined}
                    alt={user.name}
                  />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
