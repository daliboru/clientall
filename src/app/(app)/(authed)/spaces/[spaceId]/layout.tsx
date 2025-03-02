import { CalendlyButton } from '@/components/spaces/calendly-button'
import SpaceNav from '@/components/spaces/space-nav'
import { Button } from '@/components/ui/button'
import { NotFound } from '@/components/ui/not-found'
import { getCurrentUser } from '@/lib/actions/auth'
import { getSpace } from '@/lib/actions/spaces'
import { getUserById } from '@/lib/actions/users'
import { isMediaRel, isRel } from '@/lib/payload-utils'
import { ChevronLeft, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { spaceId } = await params
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const { spaceId } = await params
  const space = await getSpace(spaceId)
  const user = await getCurrentUser()

  if (!user) {
    return (
      <NotFound
        title="Authentication Required"
        description="Please sign in to access this space."
        showBack={false}
      />
    )
  }

  if (!space) {
    return (
      <NotFound
        title="Space Not Found"
        description="This space doesn't exist or you don't have permission to access it."
      />
    )
  }

  const isOwner = isRel(space.owner) && space.owner.id === user.id
  const ownerId = isRel(space.owner) ? space.owner.id : null
  const owner = isOwner ? user : ownerId ? await getUserById(ownerId) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 w-full justify-between">
          <Link href={'/dashboard'}>
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <CalendlyButton
            url={owner?.calendly_url}
            isOwner={isOwner}
            name={user.name}
            email={user.email}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-lg border flex items-center justify-center bg-muted shrink-0">
              {isMediaRel(space.logo) ? (
                <Image
                  src={space.logo.url}
                  alt={space.logo.alt}
                  className="h-full w-full object-cover rounded-lg"
                  width={64}
                  height={64}
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">{space.name}</h1>
              <p className="text-muted-foreground">{space.description}</p>
            </div>
          </div>
          <SpaceNav spaceId={space.id} isOwner={isOwner} />
        </div>

        {children}
      </div>
    </div>
  )
}
