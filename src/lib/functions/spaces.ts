import { getServerAuth } from '../getServerAuth'

export const getSpace = async (spaceId: string) => {
  const { user, payload } = await getServerAuth()

  const space = await payload.findByID({
    collection: 'spaces',
    id: spaceId,
    user,
    overrideAccess: false,
  })
  return space
}
