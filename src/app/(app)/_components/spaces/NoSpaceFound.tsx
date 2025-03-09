import { Button } from '@/app/(app)/_components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/(app)/_components/ui/card'
import Link from 'next/link'
import { Home } from 'lucide-react'

export function NoSpaceFound({
  title = 'Space Not Found',
  description = "The space you're looking for doesn't exist or you don't have permission to access it.",
  redirectHref = '/dashboard',
  buttonText = 'Return to Dashboard'
}: {
  title?: string
  description?: string
  redirectHref?: string
  buttonText?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-destructive">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link href={redirectHref}>
            <Button>
              <Home className="mr-2 h-4 w-4" />
              {buttonText}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}