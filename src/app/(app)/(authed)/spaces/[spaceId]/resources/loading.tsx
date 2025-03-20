import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(app)/_components/ui/card'
import { Skeleton } from '@/app/(app)/_components/ui/skeleton'

export default function ResourcesLoading() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-primary">Resources</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              A centralized hub for all your project materials, files, and important links. Keep
              everything organized and easily accessible to your team.
            </CardDescription>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-full sm:w-[120px]" />
            <Skeleton className="h-10 w-full sm:w-[120px]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[72px] w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
