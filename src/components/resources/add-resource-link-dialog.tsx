'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ResourceDialog } from '@/components/ui/resource-dialog'
import { Link } from 'lucide-react'
import { useState } from 'react'

interface AddLinkDialogProps {
  onSubmit: (data: { name: string; url: string }) => Promise<void>
}

export function AddLinkDialog({ onSubmit }: AddLinkDialogProps) {
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
      description="Add a new link to share with your team."
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
          placeholder="e.g. Project Documentation"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>
    </ResourceDialog>
  )
}
