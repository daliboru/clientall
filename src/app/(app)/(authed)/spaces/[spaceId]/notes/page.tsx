import { NotesCard } from '@/components/spaces/notes-card'
import { getNotes } from '@/lib/actions/notes'
import { getSpace } from '@/lib/actions/spaces'

type Params = Promise<{ spaceId: string }>

export default async function NotesPage(props: { params: Params }) {
  const { spaceId } = await props.params
  const space = await getSpace(spaceId)
  const notes = await getNotes(spaceId, 1, 3)

  if (!space || !notes) {
    return null
  }

  return (
    <div className="space-y-6">
      <NotesCard
        notes={notes.docs}
        spaceId={spaceId}
        totalPages={notes.totalPages}
        currentPage={notes.page!}
      />
    </div>
  )
}