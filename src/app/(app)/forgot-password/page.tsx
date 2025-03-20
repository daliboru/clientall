import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(app)/_components/ui/card'
import { Metadata } from 'next'
import Link from 'next/link'
import { ForgotPasswordForm } from '../_components/auth/forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot Password | Tiny Portals',
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          Tiny Portals
        </Link>
        <Card className="border-border">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold text-primary">Reset Password</CardTitle>
            <CardDescription className="text-foreground">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
