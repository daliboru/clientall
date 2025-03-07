'use client'

import { Button } from '@/app/(app)/_components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  loading: boolean
  onPageChange: (page: number) => Promise<void>
}

export function Pagination({ currentPage, totalPages, loading, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={loading || currentPage <= 1}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </>
        )}
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={loading || currentPage >= totalPages}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
