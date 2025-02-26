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
import { Button } from '@/components/ui/button'
import { deleteSpace } from '@/lib/actions/spaces'
import { toast } from '@/lib/use-toast'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DeleteSpaceProps {
  spaceId: string
  spaceName: string
}

export function DeleteSpace({ spaceId, spaceName }: DeleteSpaceProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteSpace(spaceId)
      router.replace('/dashboard')
      if (res?.success) {
        toast({
          title: 'Space deleted successfully',
          description: `The space ${spaceName} has been deleted successfully.`,
        })
      }
    } catch (error) {
      console.error('Error deleting space:', error)
      setIsDeleting(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isDeleting}>
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            'Delete Space'
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Space</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{spaceName}&quot;? This action cannot be undone
            and will permanently delete all associated data including notes and resources.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Space
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
