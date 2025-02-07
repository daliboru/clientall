'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Space } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { notFound, useParams } from 'next/navigation'

export default function SpaceSettingsPage() {
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

  if (isLoading) {
    return (
      <>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-24 w-full" />
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
        <CardHeader>
          <CardTitle>Space Settings</CardTitle>
          <CardDescription>Manage your space settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Space Name</Label>
            <Input id="name" defaultValue={space.name} placeholder="Enter space name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              defaultValue={space.description}
              placeholder="Enter space description"
            />
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Space</Button>
        </CardContent>
      </Card>
    </>
  )
}
