import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import NotFoundPage from '../not-found'

export default async function VerifyUserPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; token: string }>
}) {
  const { token, id } = await searchParams

  if (!token || !id) {
    return <NotFoundPage />
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, id }),
    })

    if (!response.ok) {
      throw new Error('Failed to verify email')
    }

    return (
      <div className="flex min-h-svh items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Email Verified</CardTitle>
            <CardDescription>Your email has been successfully verified.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Continue to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verification Failed</CardTitle>
            <CardDescription>Verification token is invalid.</CardDescription>
            <Button asChild className="w-full">
              <Link href="/">Back</Link>
            </Button>
          </CardHeader>
        </Card>
      </div>
    )
  }
}
