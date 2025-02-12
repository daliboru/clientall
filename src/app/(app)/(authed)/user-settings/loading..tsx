import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft } from 'lucide-react'

export default function UserSettingsLoading() {
  return (
    <div className="container max-w-2xl pb-6 space-y-6">
      <Button variant="outline" size="sm" disabled>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Skeleton className="h-[400px]" />
      <Skeleton className="h-[400px]" />
      <Skeleton className="h-[100px]" />
    </div>
  )
}
