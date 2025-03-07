import { SignUpForm } from '@/app/(app)/_components/auth/signup-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(app)/_components/ui/card'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function SignUpPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/dashboard`)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          Tiny Portals
        </Link>
        <Card className="border-purple-100">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold text-purple-600">Create an account</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
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
