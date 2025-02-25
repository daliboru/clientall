import { AddMemberDialog } from '@/components/spaces/add-member-dialog'
import { MemberList } from '@/components/spaces/member-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentUser } from '@/lib/actions/auth'
import { getSpace } from '@/lib/actions/spaces'
import { asManyRel, isRel } from '@/lib/payload-utils'
import { User } from '@/payload-types'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
}

export default async function SpaceMembersPage(props: { params: Params }) {
  const { spaceId } = await props.params
  const space = await getSpace(spaceId)
  const currentUser = await getCurrentUser()
  const isOwner = isRel(space?.owner) && space.owner.id === currentUser?.id
  const members = asManyRel<User>(space!.members)

  if (!space || !currentUser) return null

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold text-purple-600">
            Members ({members.length})
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Collaborate with your team members and manage access to your space. Build a strong team
            to achieve your project goals together.
          </CardDescription>
        </div>
        {isOwner && <AddMemberDialog spaceId={spaceId} />}
      </CardHeader>
      <CardContent>
        <MemberList members={members} space={space} currentUser={currentUser} isOwner={isOwner} />
      </CardContent>
    </Card>
  )
}
