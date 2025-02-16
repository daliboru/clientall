'use server'

import config from '@payload-config'
import { revalidatePath } from 'next/cache'
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

export async function createLinkResource(data: { name: string; url: string; spaceId: number }) {
  try {
    const newResource = await payload.create({
      collection: 'resources',

      data: {
        name: data.name,
        url: data.url,
        type: 'link',
        space: data.spaceId,
      },
    })

    revalidatePath(`/spaces/${data.spaceId}/resources`)
    return newResource
  } catch (error) {
    console.error(error)
  }
}

export async function createFileResource(data: { name: string; file: File; spaceId: number }) {
  try {
    const arrayBuffer = await data.file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    const file = await payload.create({
      collection: 'media',
      data: {
        alt: data.name,
      },
      file: {
        mimetype: data.file.type,
        data: fileBuffer,
        size: fileBuffer.byteLength,
        name: data.file.name,
      },
    })

    await payload.create({
      collection: 'resources',
      data: {
        name: data.name,
        type: 'file',
        space: data.spaceId,
        attachment: file.id,
      },
    })
    revalidatePath(`/spaces/${data.spaceId}/resources`)
    return
  } catch (error) {
    console.error(error)
  }
}

export async function deleteResource(id: number, spaceId: string) {
  try {
    const deletedResource = await payload.delete({
      collection: 'resources',
      id,
    })

    revalidatePath(`/spaces/${spaceId}/resources`)
    return deletedResource
  } catch (error) {
    console.error(error)
  }
}
