import { Card, CardContent, CardHeader } from '@/app/(app)/_components/ui/card'
import { Skeleton } from '@/app/(app)/_components/ui/skeleton'

export default function SpaceSettingsLoading() {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Skeleton className="h-8 w-[150px]" />
          <Skeleton className="h-5 w-[300px]" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-24 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
