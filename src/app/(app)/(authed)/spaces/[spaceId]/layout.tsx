import { isMediaRel, isRel } from '@/lib/payload-utils'
import { ChevronLeft, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getSpace } from '../../../../../lib/functions/spaces'
import { getUserById } from '../../../../../lib/functions/users'
import { getServerAuth } from '../../../../../lib/getServerAuth'
import { CalendlyButton } from '../../../_components/spaces/calendly-button'
import SpaceNav from '../../../_components/spaces/space-nav'
import { Button } from '../../../_components/ui/button'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
  const space = await getSpace(spaceId)

  return {
    title: space.name,
    description: space.description,
  }
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const { spaceId } = await params
  const { user } = await getServerAuth()
  const space = await getSpace(spaceId)

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
