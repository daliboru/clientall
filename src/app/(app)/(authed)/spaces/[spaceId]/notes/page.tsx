import { NotesCard } from '@/app/(app)/_components/spaces/notes-card'
import { getNotes } from '../../../../../../lib/functions/notes'
import { getSpace } from '../../../../../../lib/functions/spaces'

type Params = Promise<{ spaceId: string }>

export default async function NotesPage(props: { params: Params }) {
  const { spaceId } = await props.params
  const [space, notes] = await Promise.all([getSpace(spaceId), getNotes(spaceId, 1, 3)])

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
