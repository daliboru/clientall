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

export const getSpaces = async () => {
  const { user, payload } = await getServerAuth()
  const spaces = await payload.find({
    collection: 'spaces',
    user,
    overrideAccess: false,
    sort: 'title',
    limit: 100,
  })
  return spaces
}
