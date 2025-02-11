import { Card, CardHeader, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function SpaceCardSkeleton() {
  return (
    <Card className="cursor-default">
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
  )
}