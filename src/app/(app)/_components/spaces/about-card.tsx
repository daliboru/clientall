'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/app/(app)/_components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(app)/_components/ui/card'
import { asManyRel, isMediaRel } from '@/lib/payload-utils'
import { getInitials } from '@/lib/utils'
import { Space, User } from '@/payload-types'

interface AboutCardProps {
  space: Space
}

export function AboutCard({ space }: AboutCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About this portal</CardTitle>
        <CardDescription className="whitespace-pre-line">{space.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="text-sm font-medium mb-2">Members</h3>
          <div className="flex flex-wrap gap-2">
            {asManyRel<User>(space.members).map((user) => (
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
