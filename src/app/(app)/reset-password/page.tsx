import { Button } from '@/app/(app)/_components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(app)/_components/ui/card'
import { Metadata } from 'next'
import Link from 'next/link'
import { PasswordResetForm } from '../_components/auth/password-reset-form'

export const metadata: Metadata = {
  title: 'Reset Password | Tiny Portals',
}

type SearchParams = Promise<{
  token: string
}>

export default async function ResetPasswordPage(props: { searchParams: SearchParams }) {
  const { token } = await props.searchParams

  if (!token) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link href="/" className="flex items-center gap-2 self-center font-medium">
            Tiny Portals
          </Link>
          <Card>
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-2xl font-bold">Invalid Reset Link</CardTitle>
              <CardDescription className="text-destructive">
                This password reset link is invalid or has expired
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild variant="link">
                <Link href="/forgot-password">Request new reset link</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          Tiny Portals
        </Link>
        <Card className="border-purple-100">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold text-purple-600">Reset Password</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordResetForm token={token} />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link href="/login" className="text-purple-600 hover:underline">
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
