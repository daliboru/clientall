import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function MembersLoading() {
  return (
    <>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px] mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg border">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[160px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
