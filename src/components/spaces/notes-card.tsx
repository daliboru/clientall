'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteNote } from '@/lib/actions/notes'
import { isMediaRel, isRel } from '@/lib/payload-utils'
import { toast } from '@/lib/use-toast'
import { getInitials } from '@/lib/utils'
import { Note } from '@/payload-types'
import { formatDistanceToNow } from 'date-fns'
import { Trash2 } from 'lucide-react'
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

  const handleDeleteNote = async (noteId: number) => {
    const result = await deleteNote(noteId, spaceId)

    if (result.success) {
      toast({
        title: 'Note deleted successfully',
        variant: 'success',
      })
    } else {
      toast({
        title: 'Failed to delete note',
        description: result.message,
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
              <div
                key={note.id}
                className="group rounded-lg border p-4 space-y-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={isMediaRel(author.avatar) ? author.avatar.url : undefined}
                        alt={author.name}
                      />
                      <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">{author.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Note</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this note? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="pl-11">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{note.content}</p>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
