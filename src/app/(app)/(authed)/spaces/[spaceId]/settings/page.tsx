import { getSpace } from '../../../../../../lib/functions/spaces'
import { DeleteSpace } from '../../../../_components/spaces/delete-space'
import { SpaceSettingsForm } from '../../../../_components/spaces/space-settings-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../_components/ui/card'
import { NotFound } from '../../../../_components/ui/not-found'

type Params = Promise<{ spaceId: string }>

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const spaceId = params.spaceId
}

export default async function SpaceSettingsPage(props: { params: Params }) {
  const { spaceId } = await props.params
  const space = await getSpace(spaceId)

  if (!space) {
    return <NotFound description="Space not found" />
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
