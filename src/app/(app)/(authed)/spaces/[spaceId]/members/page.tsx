import { Card } from '@/app/(app)/_components/ui/card'
import { asManyRel } from '@/lib/payload-utils'
import { User } from '@/payload-types'
import { getSpace } from '../../../../../../lib/functions/spaces'
import { SpaceMembersContent } from '../../../../_components/members/space-members-content'
import { SpaceMembersHeader } from '../../../../_components/members/space-members-header'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
}

export default async function SpaceMembersPage(props: { params: Params }) {
  const { spaceId } = await props.params
  const space = await getSpace(spaceId)

  const members = asManyRel<User>(space.members)

  return (
    <Card>
      <SpaceMembersHeader
        space={space}
        membersCount={members.length}
        description="Collaborate with your team members and manage access to your space. Build a strong team to achieve your project goals together."
      />
      <SpaceMembersContent members={members} space={space} />
    </Card>
  )
}
