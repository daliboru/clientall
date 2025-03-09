import { DeliverablesCard } from '@/app/(app)/_components/deliverables/deliverables-card'
import { getDeliverables } from '@/lib/actions/deliverables'
import { getSpace } from '@/lib/actions/spaces'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
}

export default async function DeliverablesPage(props: { params: Params }) {
  const { spaceId } = await props.params
  const [space, deliverables] = await Promise.all([
    getSpace(spaceId),
    getDeliverables(spaceId, 1, 3),
  ])

  if (!deliverables || !space) {
    return null
  }

  return (
    <div className="space-y-6">
      <DeliverablesCard
        deliverables={deliverables.docs}
        spaceId={spaceId}
        totalPages={deliverables.totalPages}
        currentPage={deliverables.page!}
      />
    </div>
  )
}
