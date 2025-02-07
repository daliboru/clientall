'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { asManyRel, isMediaRel } from '@/lib/payload-utils'
import { Space, User } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { PlusCircle } from 'lucide-react'
import { notFound, useParams } from 'next/navigation'

export default function SpaceMembersPage() {
  const params = useParams<{ spaceId: string }>()

  const { data: space, isLoading } = useQuery<Space>({
    queryKey: ['space', params.spaceId],
    queryFn: async () => {
      const response = await fetch(`/api/spaces/${params.spaceId}`)
      if (!response.ok) {
        if (response.status === 404) {
          notFound()
        }
        throw new Error('Failed to fetch space')
      }
      return response.json()
    },
  })

  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  if (isLoading) {
    return (
      <>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg border">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[160px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  if (!space) return null

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>People with access to this space</CardDescription>
          </div>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              {asManyRel<User>(space.administrators || []).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={isMediaRel(member.avatar) ? member.avatar.url : undefined}
                        alt={member.name}
                      />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
