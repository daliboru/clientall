import { Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../_components/ui/card'

interface MembersCardProps {
  memberCount: number
}

export function MembersCard({ memberCount }: MembersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>People with access to this space</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Users className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-2xl font-bold">{memberCount}</p>
            <p className="text-sm text-muted-foreground">Total members</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}