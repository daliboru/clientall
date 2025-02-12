import { SpaceCard } from '@/components/dashboard/SpaceCard'
import { getCurrentUser } from '@/lib/actions/auth'
import { getSpaces } from '@/lib/actions/spaces'
import React from 'react'

const Dashboard: React.FC = async () => {
  const user = await getCurrentUser()
  const spaces = await getSpaces()

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Your Spaces</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {spaces?.map((space) => <SpaceCard key={space.id} space={space} />)}
        {(user?.relatedSpaces?.docs?.length ?? 0) === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No spaces found. Create your first space to get started.
          </p>
        )}
      </div>
    </>
  )
}

export default Dashboard
