'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { isMediaRel, isRel } from '@/lib/payload-utils'
import { getInitials } from '@/lib/utils'
import { Note } from '@/payload-types'
import { formatDistanceToNow } from 'date-fns'

interface NotesCardProps {
  notes?: { docs: Note[] }
  isLoading: boolean
}

const getNoteAuthor = (note: Note) => {
  const author = isRel(note.createdBy) ? note.createdBy : null
  return {
    name: author?.name ?? 'Unknown User',
    avatar: author?.avatar ?? null,
  }
}

export function NotesCard({ notes, isLoading }: NotesCardProps) {
  if (isLoading) {
    return (
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
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>All notes in this space</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!notes?.docs.length ? (
          <p className="text-sm text-muted-foreground">No notes yet</p>
        ) : (
          notes.docs.map((note) => {
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
  )
}
