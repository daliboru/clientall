import { getServerAuth } from '../getServerAuth'

export async function getNotes(spaceId?: number | string, page: number = 1, limit: number = 3) {
  const { user, payload } = await getServerAuth()

  if (!spaceId) return
  const notes = await payload.find({
    collection: 'notes',
    page,
    user,
    where: {
      space: {
        equals: spaceId,
      },
    },
    limit,
    sort: '-createdAt',
    overrideAccess: false,
  })
  return notes
}
