'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ResourceDialog } from '@/components/ui/resource-dialog'
import { FileText } from 'lucide-react'
import { useState } from 'react'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface AddFileDeliverableDialogProps {
  onSubmit: (data: { name: string; file: File }) => Promise<void>
}

export function AddFileDeliverableDialog({ onSubmit }: AddFileDeliverableDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        alert('File is too large. Maximum size is 10MB.')
        return
      }
      setFile(selectedFile)
      if (!name) {
        setName(selectedFile.name)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)
    try {
      await onSubmit({ name: name || file.name, file })
      setOpen(false)
      setName('')
      setFile(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ResourceDialog
      title="Upload File"
      description="Upload a file as a deliverable."
      triggerIcon={FileText}
      triggerText="Upload File"
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
          placeholder="e.g. Project Document"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="file">File</Label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          required
          className="cursor-pointer"
        />
        <p className="text-sm text-muted-foreground">Maximum file size: 10MB</p>
      </div>
    </ResourceDialog>
  )
}
