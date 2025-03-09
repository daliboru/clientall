import { SpaceCard } from '@/app/(app)/_components/dashboard/SpaceCard'
import { CreateSpaceDialog } from '@/app/(app)/_components/dashboard/create-space-dialog'
import { CreateSpaceForm } from '@/app/(app)/_components/dashboard/create-space-form'
import { getServerAuth } from '../../../../lib/getServerAuth'

export default async function Dashboard() {
  const { payload, user } = await getServerAuth()

  const spaces = await payload.find({
    collection: 'spaces',
    overrideAccess: false,
    user,
  })

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Spaces</h1>
        <CreateSpaceDialog />
      </div>

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
