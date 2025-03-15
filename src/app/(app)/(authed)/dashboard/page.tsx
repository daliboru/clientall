import { CreateSpaceDialog } from '@/app/(app)/_components/dashboard/create-space-dialog'
import { Suspense } from 'react'
import SpaceCardArray from '../../_components/dashboard/space-card-array.'
import { SpaceCardListSkeleton } from '../../_components/dashboard/space-card-skeleton'

export default function Dashboard() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Spaces</h1>
        <CreateSpaceDialog />
      </div>

      <Suspense fallback={<SpaceCardListSkeleton />}>
        <SpaceCardArray />
      </Suspense>
    </>
  )
}
