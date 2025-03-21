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
} from '@/app/(app)/_components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/(app)/_components/ui/avatar'
import { Badge } from '@/app/(app)/_components/ui/badge'
import { Button } from '@/app/(app)/_components/ui/button'
import { ScrollArea } from '@/app/(app)/_components/ui/scroll-area'
import { Separator } from '@/app/(app)/_components/ui/separator'
import { isMediaRel, isRel } from '@/lib/payload-utils'
import { useToast } from '@/lib/use-toast'
import { getInitials } from '@/lib/utils'
import { Space, User } from '@/payload-types'
import { useState } from 'react'
import { removeMember } from '../../../../lib/actions/users'

interface MemberListProps {
  members: User[]
  space: Space
  currentUser: User
  isOwner: boolean
}

export function MemberList({ members, space, currentUser, isOwner }: MemberListProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const { toast } = useToast()

  const onRemove = async (member: User) => {
    setIsRemoving(true)
    try {
      const result = await removeMember(member.id, space.id)
      if (result.success) {
        toast({
          title: 'Member removed',
          description: `${member.name} has been removed from the space.`,
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to remove member.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive',
      })
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {members.map((member, index) => (
          <div key={member.id}>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={isMediaRel(member.avatar) ? member.avatar.url : undefined}
                    alt={member.name}
                  />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{member.name}</span>
                    {isRel(space?.owner) && space?.owner.id === member.id && (
                      <Badge variant="secondary" className="text-xs">
                        Owner
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.lastLogin
                      ? `Last active: ${new Date(member.lastLogin).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}`
                      : 'Never logged in'}
                  </p>
                </div>
              </div>
              {isOwner && member.id !== currentUser?.id && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={isRemoving}
                    >
                      Remove
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove member</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {member.name} from this portal? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onRemove(member)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            {index < members.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
