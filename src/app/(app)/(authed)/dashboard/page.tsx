import { SpaceCard } from '@/app/(app)/_components/dashboard/SpaceCard'
import { SpaceCardListSkeleton } from '@/app/(app)/_components/dashboard/SpaceCardSkeleton'
import { CreateSpaceDialog } from '@/app/(app)/_components/dashboard/create-space-dialog'
import { CreateSpaceForm } from '@/app/(app)/_components/dashboard/create-space-form'
import { getSpaces } from '@/lib/actions/spaces'
import { isRel } from '@/lib/payload-utils'
import { User } from '@/payload-types'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { Suspense } from 'react'
import { HydrateClientUser } from '../../_components/HidrateClientUser'

async function SpacesContent({ user }: { user: User }) {
  const spaces = await getSpaces()

  return (
    <>
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
      ) : user.role === 'client' ? (
        <div className="text-center py-8 text-muted-foreground">
          You are not a part of any space yet.
        </div>
      ) : (
        <CreateSpaceForm />
      )}
    </>
  )
}

export default async function Dashboard() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { permissions, user } = await payload.auth({ headers })

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/dashboard`,
    )
  }

  return (
    <>
      <HydrateClientUser permissions={permissions} user={user} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Spaces</h1>
        <CreateSpaceDialog />
      </div>

      <Suspense fallback={<SpaceCardListSkeleton />}>
        <SpacesContent user={user} />
      </Suspense>
    </>
  )
}
