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
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface ResourceDialogProps {
  title: string
  description: string
  triggerIcon: LucideIcon
  triggerText: string
  isLoading?: boolean
  children: ReactNode
  onSubmit: (e: React.FormEvent) => Promise<void>
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export function ResourceDialog({
  title,
  description,
  triggerIcon: Icon,
  triggerText,
  isLoading,
  children,
  onSubmit,
  onOpenChange,
  open,
}: ResourceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
          <Icon className="h-4 w-4 mr-2" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">{children}</div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : triggerText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
