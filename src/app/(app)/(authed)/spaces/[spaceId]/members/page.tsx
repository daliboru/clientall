import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSpace } from '@/lib/actions/spaces'
import { asManyRel, isMediaRel } from '@/lib/payload-utils'
import { getInitials } from '@/lib/utils'
import { User } from '@/payload-types'
import { PlusCircle } from 'lucide-react'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
}

export default async function SpaceMembersPage(props: { params: Params }) {
  const { spaceId } = await props.params
  const space = await getSpace(spaceId)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>People with access to this space</CardDescription>
          </div>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              {asManyRel<User>(space!.administrators).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={isMediaRel(member.avatar) ? member.avatar.url : undefined}
                        alt={member.name}
                      />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
