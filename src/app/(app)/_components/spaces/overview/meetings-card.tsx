import { Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../_components/ui/card'
import { formatDistanceToNow } from 'date-fns'

interface Meeting {
  id: number
  title: string
  date: Date
  attendees: number
}

interface MeetingsCardProps {
  meetings: Meeting[]
}

export function MeetingsCard({ meetings }: MeetingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Meetings</CardTitle>
        <CardDescription>Next scheduled calls</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {meetings.length > 0 ? (
            meetings.map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{meeting.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(meeting.date, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {meeting.attendees} attendees
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming meetings</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}