import { getServerAuth } from '../getServerAuth'

export async function getDeliverables(
  spaceId?: number | string,
  page: number = 1,
  limit: number = 3,
) {
  if (!spaceId) return
  try {
    const { payload, user } = await getServerAuth()
    if (!user) return
    const deliverables = await payload.find({
      collection: 'deliverables',
      user,
      page,
      where: {
        space: {
          equals: spaceId,
        },
      },
      limit,
      sort: '-createdAt',
      overrideAccess: false,
    })
    return deliverables
  } catch (error) {
    console.error(error)
  }
}
