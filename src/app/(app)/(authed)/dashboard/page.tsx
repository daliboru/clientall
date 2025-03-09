import { SpaceCard } from '@/app/(app)/_components/dashboard/SpaceCard'
import { SpaceCardListSkeleton } from '@/app/(app)/_components/dashboard/SpaceCardSkeleton'
import { CreateSpaceDialog } from '@/app/(app)/_components/dashboard/create-space-dialog'
import { CreateSpaceForm } from '@/app/(app)/_components/dashboard/create-space-form'
import { getSpaces } from '@/lib/actions/spaces'
import { Space } from '@/payload-types'
import { Suspense } from 'react'

async function SpacesContent({ spaces }: { spaces?: Space[] }) {
  return (
    <>
      {spaces && spaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      ) : (
        <CreateSpaceForm />
      )}
    </>
  )
}

export default async function Dashboard() {
  const spaces = await getSpaces()

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Spaces</h1>
        <CreateSpaceDialog />
      </div>

      <Suspense fallback={<SpaceCardListSkeleton />}>
        <SpacesContent spaces={spaces} />
      </Suspense>
    </>
  )
}
