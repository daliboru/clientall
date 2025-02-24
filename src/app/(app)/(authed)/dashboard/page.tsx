import { SpaceCard } from '@/components/dashboard/SpaceCard'
import { CreateSpaceDialog } from '@/components/dashboard/create-space-dialog'
import { CreateSpaceForm } from '@/components/dashboard/create-space-form'
import { getCurrentUser } from '@/lib/actions/auth'
import { getSpaces } from '@/lib/actions/spaces'
import { isRel } from '@/lib/payload-utils'
import React from 'react'

const Dashboard: React.FC = async () => {
  const user = await getCurrentUser()
  const spaces = await getSpaces()

  if (!user) {
    return null
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Spaces</h1>
        <CreateSpaceDialog />
      </div>

      {spaces && spaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              isOwner={isRel(space.owner) && space.owner.id === user.id}
            />
          ))}
        </div>
      ) : user?.role === 'client' ? (
        <div className="text-center py-8 text-muted-foreground">
          You are not a part of any space yet.
        </div>
      ) : (
        <CreateSpaceForm />
      )}
    </>
  )
}

export default Dashboard
