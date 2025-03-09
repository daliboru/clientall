'use client'

import { MemberList } from '@/app/(app)/_components/spaces/member-list'
import { CardContent } from '@/app/(app)/_components/ui/card'
import { isRel } from '@/lib/payload-utils'
import { Space, User } from '@/payload-types'
import { redirect } from 'next/navigation'
import { useAuth } from '../../_providers/Auth'

export function SpaceMembersContent({ members, space }: { members: User[]; space: Space }) {
  const { user } = useAuth()

  if (!user) return redirect('/login')

  const isOwner = isRel(space.owner) && space.owner.id === user?.id

  return (
    <CardContent>
      <MemberList members={members} space={space} currentUser={user} isOwner={isOwner} />
    </CardContent>
  )
}
