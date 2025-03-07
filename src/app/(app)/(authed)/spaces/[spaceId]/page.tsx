import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSpace } from '@/lib/actions/spaces'
import { isRel } from '@/lib/payload-utils'
import { formatDistanceToNow } from 'date-fns'
import { Calendar, Home, Users } from 'lucide-react'
import Link from 'next/link'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
}

export default async function SpacePage(props: { params: Params }) {
  const { spaceId } = await props.params
  const space = await getSpace(spaceId)

  if (!space) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Space Not Found</CardTitle>
            <CardDescription className="text-center">
              {`The space you're looking for doesn't exist or you don't have permission to access it.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/dashboard">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Dummy meetings data
  const upcomingMeetings = [
    {
      id: 1,
      title: 'Weekly Sync',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      attendees: 4,
    },
    {
      id: 2,
      title: 'Project Review',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      attendees: 6,
    },
  ]

  const memberCount = space.members.length
  const noteCount = space.relatedNotes?.docs?.length ?? 0
  const resourceCount = space.relatedResources?.docs?.length ?? 0
  const owner = isRel(space.owner) ? space.owner : null
  const createdAt = formatDistanceToNow(new Date(space.createdAt), { addSuffix: true })

  return (
    <div className="space-y-6 pb-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Space information</CardDescription>
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

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
            <CardDescription>Next scheduled calls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.length > 0 ? (
                upcomingMeetings.map((meeting) => (
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
      </div>
    </div>
  )
}
