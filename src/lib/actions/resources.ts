'use server'

import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
export async function getResources(spaceId?: number | string, page: number = 1, limit: number = 3) {
  if (!spaceId) return
  try {
    const resources = await payload.find({
      collection: 'resources',
      where: {
        space: {
          equals: spaceId,
        },
      },
      page,
      limit,
      sort: '-createdAt',
    })
    return resources
  } catch (error) {
    console.error(error)
  }
}

export async function createLinkResource(data: { name: string; url: string; spaceId: number }) {
  try {
    await payload.create({
      collection: 'resources',
      data: {
        name: data.name,
        url: data.url,
        type: 'link',
        space: data.spaceId,
      },
    })

    const updatedResources = await getResources(data.spaceId, 1)
    revalidatePath(`/spaces/${data.spaceId}/resources`)
    return { 
      success: true, 
      resources: updatedResources 
    }
  } catch (error) {
    console.error(error)
    return { success: false }
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

    const updatedResources = await getResources(data.spaceId, 1)
    revalidatePath(`/spaces/${data.spaceId}/resources`)
    return { 
      success: true, 
      resources: updatedResources 
    }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}

export async function deleteResource(id: number, spaceId: string, currentPage: number = 1) {
  try {
    await payload.delete({
      collection: 'resources',
      id,
    })

    const updatedResources = await getResources(spaceId, currentPage)
    revalidatePath(`/spaces/${spaceId}/resources`)
    return { 
      message: 'Resource deleted successfully', 
      success: true,
      resources: updatedResources
    }
  } catch (error) {
    console.error(error)
    return { message: 'Error deleting resource', success: false }
  }
}
