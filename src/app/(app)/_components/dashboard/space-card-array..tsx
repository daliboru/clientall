import { getSpaces } from '../../../../lib/functions/spaces'
import { CreateSpaceForm } from './create-space-form'
import { SpaceCard } from './space-card'

export default async function SpaceCardArray() {
  const spaces = await getSpaces()

  return (
    <>
      {spaces.docs && spaces.docs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spaces.docs.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      ) : (
        <CreateSpaceForm />
      )}
    </>
  )
}
