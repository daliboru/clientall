'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { asManyRel, isMediaRel } from '@/lib/payload-utils'
import { Space, User } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { notFound, useParams, useRouter } from 'next/navigation'

export default function SpacePage() {
  const params = useParams<{ spaceId: string }>()
  const router = useRouter()

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
      <div className="space-y-6">
        <Button variant="outline" size="sm" className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Skeleton className="h-12 w-[250px]" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="flex -space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full border-2 border-background" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!space) {
    return null
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" className="mb-6" onClick={() => router.back()}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <h1 className="text-3xl font-bold">{space.name}</h1>
      <Card>
        <CardHeader>
          <CardTitle>About this space</CardTitle>
          <CardDescription>{space.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <h3 className="text-sm font-medium mb-2">Administrators</h3>
            <div className="flex flex-wrap gap-2">
              {asManyRel<User>(space.administrators).map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={isMediaRel(admin.avatar) ? admin.avatar.url : undefined}
                      alt={admin.name}
                    />
                    <AvatarFallback>{getInitials(admin.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{admin.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
