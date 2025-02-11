import { SpaceCardSkeleton } from '@/components/dashboard/SpaceCardSkeleton'

export default function DashboardLoading() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Your Spaces</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SpaceCardSkeleton key={i} />
        ))}
      </div>
    </>
  )
}
