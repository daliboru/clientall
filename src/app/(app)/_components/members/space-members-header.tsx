'use client'

import { AddMemberDialog } from '@/app/(app)/_components/spaces/add-member-dialog'
import { CardDescription, CardHeader, CardTitle } from '@/app/(app)/_components/ui/card'
import { isRel } from '@/lib/payload-utils'
import { Space } from '@/payload-types'
import { useAuth } from '../../_providers/Auth'

export function SpaceMembersHeader({
  space,
  membersCount,
}: {
  space: Space
  membersCount: number
}) {
  const { user } = useAuth()

  const isOwner = isRel(space.owner) && space.owner.id === user?.id

  return (
    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <CardTitle className="text-2xl font-bold text-purple-600">
          Members ({membersCount})
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          {
            'Collaborate with your team members and manage access to your space. Build a strong team to achieve your project goals together.'
          }
        </CardDescription>
      </div>
      {isOwner && <AddMemberDialog spaceId={space.id} />}
    </CardHeader>
  )
}
