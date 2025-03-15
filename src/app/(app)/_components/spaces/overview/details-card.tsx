import { User } from '@/payload-types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../_components/ui/card'

interface DetailsCardProps {
  createdAt: string
  owner: User | null
}

export function DetailsCard({ createdAt, owner }: DetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardDescription>Portal information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span>{createdAt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Owner</span>
            <span className="truncate max-w-40">{owner?.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
