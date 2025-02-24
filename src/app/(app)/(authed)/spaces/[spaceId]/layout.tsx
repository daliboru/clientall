import SpaceNav from '@/components/spaces/space-nav'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/actions/auth'
import { getSpace } from '@/lib/actions/spaces'
import { isMediaRel, isRel } from '@/lib/payload-utils'
import { Calendar, ChevronLeft, ImageIcon } from 'lucide-react'
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

  if (!space || !user) {
    return null
  }

  const isOwner = isRel(space.owner) && space.owner.id === user.id

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
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Call
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-lg border flex items-center justify-center bg-muted shrink-0 overflow-hidden">
              {isMediaRel(space.logo) ? (
                <Image
                  src={space.logo.url}
                  alt={space.logo.alt}
                  className="h-full w-full object-cover"
                  width={64}
                  height={64}
                  priority
                  unoptimized={false}
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
