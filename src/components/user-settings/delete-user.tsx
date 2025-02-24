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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteUser } from '@/lib/actions/users'
import { toast } from '@/lib/use-toast'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  userId: number
}

export function DeleteUser({ userId }: Props) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteUser = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteUser(userId)

      if (result.success) {
        toast({
          title: 'Account deleted',
          description: 'Your account has been deleted.',
          variant: 'destructive',
        })
        router.push('/login')
      } else {
        toast({
          title: 'Failed to delete account',
          description: result.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>Permanently delete your account and all of your data.</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDeleteUser}
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
