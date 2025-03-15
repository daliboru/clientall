'use client'

import { Button } from '@/app/(app)/_components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/(app)/_components/ui/dialog'
import { Textarea } from '@/app/(app)/_components/ui/textarea'
import { createNote } from '@/lib/actions/notes'
import { useToast } from '@/lib/use-toast'
import { Note } from '@/payload-types'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

interface AddNoteDialogProps {
  spaceId: string
  onSuccess: (notes: Note[]) => void
}

export function AddNoteDialog({ spaceId, onSuccess }: AddNoteDialogProps) {
  const [content, setContent] = useState('')
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await createNote(content, spaceId)

      if (result.success && result.notes?.docs) {
        onSuccess(result.notes.docs)
        setContent('')
        setOpen(false)
        toast({
          title: 'Note created successfully',
          variant: 'success',
        })
      } else {
        toast({
          title: 'Failed to create note',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-full sm:w-auto active:scale-95 transition-transform"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Adding...
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Note
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>Create a new note in this space.</DialogDescription>
        </DialogHeader>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          className="min-h-[200px]"
          disabled={isSubmitting}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Adding...
              </>
            ) : (
              'Add Note'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
