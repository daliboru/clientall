import { AboutCard } from '@/components/spaces/about-card'
import { NotesCard } from '@/components/spaces/notes-card'
import { ResourcesCard } from '@/components/spaces/resources-card'
import { getNotes } from '@/lib/actions/notes'
import { getResources } from '@/lib/actions/resources'
import { getSpace } from '@/lib/actions/spaces'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
}

export default async function SpacePage(props: { params: Params }) {
  const { spaceId } = await props.params

  const space = await getSpace(spaceId)
  const notes = await getNotes(spaceId)
  const resources = await getResources(spaceId)

  if (!space || !notes || !resources) {
    return null
  }

  return (
    <div className="space-y-6">
      <AboutCard space={space} />
      <NotesCard notes={notes.docs} spaceId={spaceId} />
      <ResourcesCard resources={resources.docs} spaceId={spaceId} />
    </div>
  )
}
