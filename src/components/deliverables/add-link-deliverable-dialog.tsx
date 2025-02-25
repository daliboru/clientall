'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ResourceDialog } from '@/components/ui/resource-dialog'
import { Link } from 'lucide-react'
import { useState } from 'react'

interface AddLinkDeliverableDialogProps {
  onSubmit: (data: { name: string; url: string }) => Promise<void>
}

export function AddLinkDeliverableDialog({ onSubmit }: AddLinkDeliverableDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit({ name, url })
      setOpen(false)
      setName('')
      setUrl('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ResourceDialog
      title="Add Link"
      description="Add a link as a deliverable."
      triggerIcon={Link}
      triggerText="Add Link"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Project Requirements"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          required
        />
      </div>
    </ResourceDialog>
  )
}
