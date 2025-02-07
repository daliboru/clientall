'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { asManyRel, isMediaRel, isRel } from '@/lib/payload-utils'
import { Note, Space, User } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { notFound, useParams, useRouter } from 'next/navigation'

const getNoteAuthor = (note: Note) => {
  const author = isRel(note.createdBy) ? note.createdBy : null
  return {
    name: author?.name ?? 'Unknown User',
    avatar: author?.avatar ?? null,
  }
}

export default function SpacePage() {
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
        {/* About Card Loading State */}
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-[150px] mb-2" />
            <Skeleton className="h-5 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-[100px] mb-4" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full"
                >
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes Card Loading State */}
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-[100px] mb-2" />
            <Skeleton className="h-5 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Separator />
              </div>
            ))}
          </CardContent>
        </Card>
      </>
    )
  }

  if (!space) {
    return null
  }

  return (
    <>
      {/* About Card */}
      <Card>
        <CardHeader>
          <CardTitle>About this space</CardTitle>
          <CardDescription>{space.description}</CardDescription>
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

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>All notes in this space</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {asManyRel<Note>(space.relatedNotes).length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes yet</p>
          ) : (
            asManyRel<Note>(space.relatedNotes).map((note) => {
              const author = getNoteAuthor(note)
              return (
                <div key={note.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={isMediaRel(author.avatar) ? author.avatar.url : undefined}
                        alt={author.name}
                      />
                      <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">{note.content}</p>
                  <Separator />
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </>
  )
}
