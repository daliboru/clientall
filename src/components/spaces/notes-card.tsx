'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import { isMediaRel, isRel } from '@/lib/payload-utils'
import { getInitials } from '@/lib/utils'
import { Note } from '@/payload-types'
import { formatDistanceToNow } from 'date-fns'
import { createNote } from '../../lib/actions/notes'
import { AddNoteDialog } from './add-note-dialog'

interface NotesCardProps {
  notes: Note[]
  spaceId: string
}

const getNoteAuthor = (note: Note) => {
  const author = isRel(note.createdBy) ? note.createdBy : null
  return {
    name: author?.name ?? 'Unknown User',
    avatar: author?.avatar ?? null,
  }
}

export function NotesCard({ notes, spaceId }: NotesCardProps) {
  const handleAddNote = async (content: string) => {
    const result = await createNote(content, spaceId)

    if (result.success) {
      // Refresh the data
      toast({
        title: 'Note created successfully',
        variant: 'success',
      })
    } else {
      toast({
        title: 'Something went wrong while creating the note',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Notes</CardTitle>
          <CardDescription>All notes in this space</CardDescription>
        </div>
        <AddNoteDialog onSubmit={handleAddNote} />
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet</p>
        ) : (
          notes.map((note) => {
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
