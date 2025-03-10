'use server'

import { getServerAuth } from '../getServerAuth'

export async function getDeliverables(spaceId: number | string, page = 1) {
  const { user, payload } = await getServerAuth()

  const deliverables = await payload.find({
    collection: 'deliverables',
    page,
    user,
    where: {
      space: {
        equals: spaceId,
      },
    },
    limit: 3,
    sort: '-createdAt',
    overrideAccess: false,
  })

  return deliverables
}
