import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../_components/ui/card'

interface ActivityCardProps {
  noteCount: number
  resourceCount: number
}

export function ActivityCard({ noteCount, resourceCount }: ActivityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Recent content updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Notes</span>
            <span className="font-medium">{noteCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Resources</span>
            <span className="font-medium">{resourceCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}