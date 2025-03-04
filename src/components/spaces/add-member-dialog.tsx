'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { addMember } from '@/lib/actions/members'
import { toast } from '@/lib/use-toast'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

export function AddMemberDialog({ spaceId }: { spaceId: string }) {
  const [email, setEmail] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await addMember(email.trim(), spaceId)

      if (result.success) {
        toast({
          title: 'Member invited',
          description: result.isNewUser
            ? 'An invitation has been sent to complete their profile'
            : 'Successfully added member to the space',
        })
        setOpen(false)
        setEmail('')
      } else {
        setError(result.errors[0].message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Enter the email address of the person you want to invite.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding member...' : 'Add Member'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
