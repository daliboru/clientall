import { CompleteProfileForm } from '@/components/auth/complete-profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function CompleteProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Token</CardTitle>
            <CardDescription>This link is invalid or has expired.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Set up your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <CompleteProfileForm token={token} />
        </CardContent>
      </Card>
    </div>
  )
}
