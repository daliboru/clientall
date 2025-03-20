import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(app)/_components/ui/card'
import { ScrollArea } from '@/app/(app)/_components/ui/scroll-area'
import { Separator } from '@/app/(app)/_components/ui/separator'
import { Skeleton } from '@/app/(app)/_components/ui/skeleton'

export default function MembersLoading() {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primary">Members</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {
              'Collaborate with your team members and manage access to your space. Build a strong team to achieve your project goals together.'
            }
          </CardDescription>
        </div>
        <Skeleton className="h-10 w-full sm:w-[120px]" />
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
                      <Skeleton className="h-4 w-[120px]" />
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
