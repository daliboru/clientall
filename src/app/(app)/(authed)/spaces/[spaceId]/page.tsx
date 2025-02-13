import { AboutCard } from '@/components/spaces/about-card'
import { NotesCard } from '@/components/spaces/notes-card'
import { getNotes } from '@/lib/actions/notes'
import { getSpace } from '@/lib/actions/spaces'
import { ResourcesCard } from '@/components/spaces/resources-card'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
}

export default async function SpacePage(props: { params: Params }) {
  const { spaceId } = await props.params

  const space = await getSpace(spaceId)
  const notes = await getNotes(spaceId)

  if (!space || !notes) {
    return null
  }

  return (
    <div className="space-y-6">
      <AboutCard space={space} />
      <NotesCard notes={notes.docs} spaceId={spaceId} />
      <ResourcesCard spaceId={spaceId} />
    </div>
  )
}
