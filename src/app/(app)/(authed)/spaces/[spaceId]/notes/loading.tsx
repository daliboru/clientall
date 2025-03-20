import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(app)/_components/ui/card'
import { Skeleton } from '@/app/(app)/_components/ui/skeleton'

export default function NotesLoading() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-primary">Notes</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Share important updates, announcements, and insights with your team. Keep everyone
              informed and aligned on project progress and key decisions.
            </CardDescription>
          </div>
          <Skeleton className="h-10 w-full sm:w-[120px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
              <Skeleton className="h-[72px] w-full" />
            </div>
          ))}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
