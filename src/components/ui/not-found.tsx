'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NotFoundProps {
  title?: string
  description?: string
  showBack?: boolean
  showHome?: boolean
}

export function NotFound({
  title = 'Not Found',
  description = "The page you're looking for doesn't exist or you don't have permission to access it.",
  showBack = true,
  showHome = true,
}: NotFoundProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-destructive">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-2">
          {showBack && (
            <Button variant="outline" onClick={() => router.back()}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          )}
          {showHome && (
            <Link href="/dashboard">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  )
}