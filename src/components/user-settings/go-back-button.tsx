'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function GoBackButton() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <Button variant="outline" size="sm" onClick={handleGoBack}>
      <ChevronLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  )
}
