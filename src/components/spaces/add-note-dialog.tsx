'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

interface AddNoteDialogProps {
  onSubmit: (content: string) => Promise<void>
  isSubmitting?: boolean
}

export function AddNoteDialog({ onSubmit, isSubmitting }: AddNoteDialogProps) {
  const [content, setContent] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return
    await onSubmit(content)
    setContent('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Note
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
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? 'Adding...' : 'Add Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
