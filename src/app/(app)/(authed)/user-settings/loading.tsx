import { Button } from '@/app/(app)/_components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(app)/_components/ui/card'
import { Skeleton } from '@/app/(app)/_components/ui/skeleton'
import { ChevronLeft } from 'lucide-react'

export default function UserSettingsLoading() {
  return (
    <div className="container max-w-2xl pb-6 space-y-6">
      <Button variant="outline" size="sm" disabled>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-600">Profile Settings</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Manage your account settings and profile information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>Profile Picture</div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-9 w-24" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
          <Skeleton className="h-9 w-32" />
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Permanently delete your account and all of your data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-9 w-32 bg-destructive/10" />
        </CardContent>
      </Card>
    </div>
  )
}
