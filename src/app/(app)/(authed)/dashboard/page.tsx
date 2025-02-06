'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { asManyRel, isMediaRel } from '@/lib/payload-utils'
import { Space, User } from '@/payload-types'
import { useRouter } from 'next/navigation'
import React from 'react'

const Dashboard: React.FC = () => {
  const router = useRouter()
  const { data: user, isLoading } = useCurrentUser()

  const handleSpaceClick = (spaceId: number) => {
    router.push(`/spaces/${spaceId}`)
  }

  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Your Spaces</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="cursor-default">
                <CardHeader>
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-full" />
                </CardHeader>
                <CardFooter className="justify-end">
                  <div className="flex -space-x-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-background"
                      />
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))
          : asManyRel<Space>(user?.spaces).map((space) => (
              <Card
                key={space.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSpaceClick(space.id)}
              >
                <CardHeader>
                  <CardTitle>{space.name}</CardTitle>
                  <CardDescription>
                    {space.description || 'No description available'}
                  </CardDescription>
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
            ))}
        {!isLoading && (user?.spaces?.length ?? 0) === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No spaces found. Create your first space to get started.
          </p>
        )}
      </div>
    </>
  )
}

export default Dashboard
