import { DeleteSpace } from '@/components/spaces/delete-space'
import { SpaceSettingsForm } from '@/components/spaces/space-settings-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSpace } from '@/lib/actions/spaces'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
}

export default async function SpaceSettingsPage(props: { params: Params }) {
  const { spaceId } = await props.params
  const space = await getSpace(spaceId)

  if (!space) {
    return null
  }

  return (
    <>
      <SpaceSettingsForm space={space} />

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteSpace spaceId={spaceId} spaceName={space.name} />
        </CardContent>
      </Card>
    </>
  )
}
