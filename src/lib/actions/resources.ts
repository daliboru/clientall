'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
export async function getResources(spaceId?: number | string) {
  if (!spaceId) return
  try {
    const resources = await payload.find({
      collection: 'resources',
      where: {
        space: {
          equals: spaceId,
        },
      },
    })
    return resources
  } catch (error) {
    console.error(error)
  }
}
