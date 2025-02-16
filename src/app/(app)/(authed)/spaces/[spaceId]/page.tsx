import { AboutCard } from '@/components/spaces/about-card'
import { NotesCard } from '@/components/spaces/notes-card'
import { getNotes } from '@/lib/actions/notes'
import { getSpace } from '@/lib/actions/spaces'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
}

// Remove the ResourcesCard import and getResources import

export default async function SpacePage(props: { params: Params }) {
  const { spaceId } = await props.params

  const space = await getSpace(spaceId)
  const notes = await getNotes(spaceId, 1, 3) // Set limit to 3

  if (!space || !notes) {
    return null
  }

  return (
    <div className="space-y-6 pb-6">
      <AboutCard space={space} />
      <NotesCard
        notes={notes.docs}
        spaceId={spaceId}
        totalPages={notes.totalPages}
        currentPage={notes.page!}
      />
    </div>
  )
}
