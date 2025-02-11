'use client'

import { LoginForm } from '@/components/login-form'
import { authService } from '@/lib/services/auth/authService'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect } from 'react'

function LoginContent() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (!user) throw new Error('User not found')

        router.push('/dashboard')
      } catch (error) {
        // User is not logged in, stay on login page
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link href="/" className="flex items-center gap-2 self-center font-medium">
        ClientAll
      </Link>
      <LoginForm />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <Suspense>
        <LoginContent />
      </Suspense>
    </div>
  )
}
