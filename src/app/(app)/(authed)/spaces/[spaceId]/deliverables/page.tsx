import { DeliverablesCard } from '@/app/(app)/_components/deliverables/deliverables-card'
import { getDeliverables } from '@/lib/actions/deliverables'
import { getSpace } from '@/lib/actions/spaces'
import { isRel } from '@/lib/payload-utils'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
}

export default async function DeliverablesPage(props: { params: Params }) {
  const { spaceId } = await props.params
  const space = await getSpace(spaceId)
  const deliverables = await getDeliverables(spaceId, 1, 3)

  if (!deliverables || !space) {
    return null
  }

  const isOwner = isRel(space.owner) && space.owner.id === space.owner.id

  return (
    <div className="space-y-6">
      <DeliverablesCard
        deliverables={deliverables.docs}
        spaceId={spaceId}
        totalPages={deliverables.totalPages}
        currentPage={deliverables.page!}
        isOwner={isOwner}
      />
    </div>
  )
}
