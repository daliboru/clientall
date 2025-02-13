import SpaceNav from '@/components/spaces/space-nav'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/actions/auth'
import { getSpace } from '@/lib/actions/spaces'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { spaceId } = await params
}

import { Calendar } from 'lucide-react'

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

  if (!space) {
    return null
  }

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
          <h1 className="text-3xl font-bold mb-4">{space.name}</h1>
          <SpaceNav spaceId={space.id} user={user} />
        </div>

        {children}
      </div>
    </div>
  )
}
