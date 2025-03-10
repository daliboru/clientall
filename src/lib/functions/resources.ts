'use server'

import { getServerAuth } from '../getServerAuth'

export async function getResources(spaceId?: number | string, page: number = 1, limit: number = 3) {
  if (!spaceId) return
  try {
    const { user, payload } = await getServerAuth()
    const resources = await payload.find({
      collection: 'resources',
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
    return resources
  } catch (error) {
    console.error(error)
  }
}
