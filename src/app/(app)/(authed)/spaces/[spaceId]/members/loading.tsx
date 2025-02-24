import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export default function MembersLoading() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>
            <Skeleton className="h-5 w-[120px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[200px] mt-1" />
          </CardDescription>
        </div>
        <Skeleton className="h-9 w-[120px]" />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <div className="flex items-center justify-between p-3 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-4 w-[60px]" />
                      </div>
                      <Skeleton className="h-3 w-[160px]" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-[70px]" />
                </div>
                {i < 4 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
