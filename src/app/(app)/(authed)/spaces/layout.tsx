'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Space } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { ReactNode } from 'react'
import SpaceNav from './[spaceId]/_components/space-nav'

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const params = useParams<{ spaceId: string }>()

  const { data: space, isLoading } = useQuery<Space>({
    queryKey: ['space', params.spaceId],
    queryFn: async () => {
      const response = await fetch(`/api/spaces/${params.spaceId}`)
      if (!response.ok) {
        if (response.status === 404) {
          notFound()
        }
        throw new Error('Failed to fetch space')
      }
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Skeleton className="h-12 w-[250px]" />
        {children}
      </div>
    )
  }

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
          <h1 className="text-3xl font-bold mb-4">{space.name}</h1>
          <SpaceNav spaceId={space.id} />
        </div>

        {children}
      </div>
    </div>
  )
}

export default Layout
