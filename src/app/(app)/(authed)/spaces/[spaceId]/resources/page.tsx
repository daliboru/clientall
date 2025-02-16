import { ResourcesCard } from '@/components/resources/resources-card'
import { getResources } from '@/lib/actions/resources'

interface Params {
  spaceId: string
}

export default async function ResourcesPage({ params }: { params: Params }) {
  const { spaceId } = await params
  const resources = await getResources(spaceId)

  if (!resources) {
    return null
  }

  return (
    <div className="space-y-6">
      <ResourcesCard resources={resources.docs} spaceId={spaceId} />
    </div>
  )
}
