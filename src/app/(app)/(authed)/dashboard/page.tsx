'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useCurrentUser } from '../../../../hooks/useCurrentUser'

const Dashboard: React.FC = () => {
  const router = useRouter()
  const { data: user, isLoading } = useCurrentUser()

  const handleSpaceClick = (spaceId: string) => {
    router.push(`/spaces/${spaceId}`)
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Your Spaces</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="cursor-default">
                <CardHeader>
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-full" />
                </CardHeader>
              </Card>
            ))
          : user?.spaces?.map((space) => (
              <Card
                key={space.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSpaceClick(space.id)}
              >
                <CardHeader>
                  <CardTitle>{space.name}</CardTitle>
                  <CardDescription>
                    {space.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
        {!isLoading && user?.spaces?.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No spaces found. Create your first space to get started.
          </p>
        )}
      </div>
    </>
  )
}

export default Dashboard
