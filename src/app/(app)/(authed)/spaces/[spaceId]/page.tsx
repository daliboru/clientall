import { isRel } from '@/lib/payload-utils'
import { getSpace } from '../../../../../lib/functions/spaces'
import { NoSpaceFound } from '../../../_components/spaces/NoSpaceFound'
import { ActivityCard } from '../../../_components/spaces/overview/activity-card'
import { DeliverablesCard } from '../../../_components/spaces/overview/deliverables-card'
import { DetailsCard } from '../../../_components/spaces/overview/details-card'
import { MeetingsCard } from '../../../_components/spaces/overview/meetings-card'
import { MembersCard } from '../../../_components/spaces/overview/members-card'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
}

export default async function SpacePage(props: { params: Params }) {
  const { spaceId } = await props.params
  const space = await getSpace(spaceId)

  if (!space) {
    return <NoSpaceFound />
  }

  // Dummy meetings data
  const upcomingMeetings = [
    {
      id: 1,
      title: 'Weekly Sync',
      date: new Date('2023-08-10T10:00:00Z'),
      attendees: 4,
    },
    {
      id: 2,
      title: 'Project Review',
      date: new Date('2023-08-15T14:30:00Z'),
      attendees: 6,
    },
  ]

  const memberCount = space.members.length
  const noteCount = space.relatedNotes?.docs?.length ?? 0
  const resourceCount = space.relatedResources?.docs?.length ?? 0
  const owner = isRel(space.owner) ? space.owner : null
  const createdAt = new Date(space.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Add deliverables data
  const deliverables = space.relatedDeliverables?.docs ?? []
  const statusCounts = {
    approved: deliverables.filter((d) => isRel(d) && d.status === 'approved').length || 0,
    pending: deliverables.filter((d) => isRel(d) && !d.status).length || 0,
    correction: deliverables.filter((d) => isRel(d) && d.status === 'correction').length || 0,
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MembersCard memberCount={memberCount} />
        <ActivityCard noteCount={noteCount} resourceCount={resourceCount} />
        <DetailsCard createdAt={createdAt} owner={owner} />
        <MeetingsCard meetings={upcomingMeetings} />
        <DeliverablesCard statusCounts={statusCounts} totalCount={deliverables.length} />
      </div>
    </div>
  )
}
