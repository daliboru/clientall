import { ResourcesCard } from '@/components/resources/resources-card'
import { getResources } from '@/lib/actions/resources'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
}

export default async function ResourcesPage(props: { params: Params }) {
  const { spaceId } = await props.params
  const resources = await getResources(spaceId, 1, 3)

  if (!resources) {
    return null
  }

  return (
    <div className="space-y-6">
      <ResourcesCard 
        resources={resources.docs} 
        spaceId={spaceId}
        totalPages={resources.totalPages}
        currentPage={resources.page!}
      />
    </div>
  )
}
