import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../_components/ui/card'
import { Badge } from '../../../_components/ui/badge'

interface StatusCounts {
  approved: number
  pending: number
  correction: number
}

interface DeliverablesCardProps {
  statusCounts: StatusCounts
  totalCount: number
}

export function DeliverablesCard({ statusCounts, totalCount }: DeliverablesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deliverables</CardTitle>
        <CardDescription>Current submission statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{totalCount} Total</h3>
            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300" 
                style={{ 
                  width: `${(statusCounts.approved / totalCount) * 100 || 0}%`
                }}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Approved</span>
              </div>
              <Badge variant="outline" className="border-green-300 text-green-800">
                {statusCounts.approved} ({Math.round((statusCounts.approved / totalCount) * 100) || 0}%)
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Pending Review</span>
              </div>
              <Badge variant="outline" className="border-blue-300 text-blue-800">
                {statusCounts.pending}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm">Needs Correction</span>
              </div>
              <Badge variant="outline" className="border-red-300 text-red-800">
                {statusCounts.correction}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}