import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function SpaceSettingsLoading() {
  return (
    <>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px] mb-2" />
          <Skeleton className="h-4 w-full" />
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
    </>
  )
}
