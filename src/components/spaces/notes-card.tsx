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
import { deleteNote, getNotes } from '@/lib/actions/notes'
import { getNoteAuthor, isMediaRel } from '@/lib/payload-utils'
import { toast } from '@/lib/use-toast'
import { getInitials } from '@/lib/utils'
import { Note } from '@/payload-types'
import { formatDistanceToNow } from 'date-fns'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { createNote } from '../../lib/actions/notes'
import { AddNoteDialog } from './add-note-dialog'

interface NotesCardProps {
  notes: Note[]
  spaceId: string
  totalPages: number
  currentPage: number
}

export function NotesCard({
  notes: initialNotes,
  spaceId,
  totalPages,
  currentPage,
}: NotesCardProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [page, setPage] = useState(currentPage)
  const [loading, setLoading] = useState(false)

  const fetchNotes = async (pageNumber: number) => {
    setLoading(true)
    try {
      const response = await getNotes(spaceId, pageNumber)
      if (response?.docs) {
        setNotes(response.docs)
        setPage(pageNumber)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async (content: string) => {
    const result = await createNote(content, spaceId)

    if (result.success) {
      if (result.notes?.docs) {
        setNotes(result.notes.docs)
        setPage(1)
      }
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
    const result = await deleteNote(noteId, spaceId, page)

    if (result.success) {
      if (result.notes?.docs) {
        setNotes(result.notes.docs)
        // If we're on a page with no notes after deletion, go to previous page
        if (result.notes.docs.length === 0 && page > 1) {
          fetchNotes(page - 1)
        }
      }
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

  const [expandedNotes, setExpandedNotes] = useState<number[]>([])

  const toggleNote = (noteId: number) => {
    setExpandedNotes((prev) =>
      prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId],
    )
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
            const isExpanded = expandedNotes.includes(note.id)
            const shouldTruncate = note.content.length > 280

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
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {shouldTruncate && !isExpanded
                      ? `${note.content.slice(0, 280)}...`
                      : note.content}
                  </p>
                  {shouldTruncate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => toggleNote(note.id)}
                    >
                      <span className="text-xs flex items-center gap-1">
                        {isExpanded ? (
                          <>
                            Show less <ChevronUp className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            Show more <ChevronDown className="h-3 w-3" />
                          </>
                        )}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNotes(page - 1)}
            disabled={loading || page <= 1}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </>
            )}
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNotes(page + 1)}
            disabled={loading || page >= totalPages}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
