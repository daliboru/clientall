'use client'

import { Button } from '@/app/(app)/_components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/(app)/_components/ui/dialog'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { SpaceForm } from './space-form'

export function CreateSpaceDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Space
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Space</DialogTitle>
          <DialogDescription>Create a new space for your team</DialogDescription>
        </DialogHeader>
        <SpaceForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
