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
} from '@/app/(app)/_components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/(app)/_components/ui/avatar'
import { Button } from '@/app/(app)/_components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(app)/_components/ui/card'
import { Pagination } from '@/app/(app)/_components/ui/pagination'
import { getNoteAuthor, isMediaRel } from '@/lib/payload-utils'
import { getInitials } from '@/lib/utils'
import { Note } from '@/payload-types'
import { formatDistanceToNow } from 'date-fns'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { deleteNote } from '../../../../lib/actions/notes'
import { getNotes } from '../../../../lib/functions/notes'
import { useToast } from '../../../../lib/use-toast'
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
  const [expandedNotes, setExpandedNotes] = useState<number[]>([])
  const { toast } = useToast()

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

  const handleNotesUpdate = (updatedNotes: Note[]) => {
    setNotes(updatedNotes)
    setPage(1)
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

  const toggleNote = (noteId: number) => {
    setExpandedNotes((prev) =>
      prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId],
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primary">Notes</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Share important updates, announcements, and insights with your team. Keep everyone
            informed and aligned on project progress and key decisions.
          </CardDescription>
        </div>
        <div className="flex w-full sm:w-auto">
          <AddNoteDialog spaceId={spaceId} onSuccess={handleNotesUpdate} />
        </div>
      </CardHeader>
      <CardContent>
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
                className="group rounded-lg border p-4 space-y-3 hover:bg-muted/50 transition-colors mb-4 last:mb-0"
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
        {notes.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            loading={loading}
            onPageChange={fetchNotes}
          />
        )}
      </CardContent>
    </Card>
  )
}
