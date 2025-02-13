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
        <div className="flex items-center gap-4">
          <Link href={'/dashboard'}>
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <div className="w-full flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{space.name}</h1>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Call
            </Button>
          </div>
          <SpaceNav spaceId={space.id} user={user} />
        </div>

        {children}
      </div>
    </div>
  )
}
