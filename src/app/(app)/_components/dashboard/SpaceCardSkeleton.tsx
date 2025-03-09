import { Card, CardFooter, CardHeader } from '@/app/(app)/_components/ui/card'
import { Skeleton } from '@/app/(app)/_components/ui/skeleton'

export function SpaceCardListSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="cursor-default">
            <CardHeader>
              <Skeleton className="h-7 w-3/4 mb-2" />
              <Skeleton className="h-5 w-full" />
            </CardHeader>
            <CardFooter className="justify-end">
              <div className="flex -space-x-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded-full border-2 border-background" />
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}
