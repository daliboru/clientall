'use server'

import { revalidatePath } from 'next/cache'
import { getDeliverables } from '../get/deliverables'
import { getServerAuth } from '../getServerAuth'
import { asManyRel, isRel } from '../payload-utils'

export async function createLinkDeliverable(data: {
  name: string
  url: string
  spaceId: number
  status?: 'pending' | 'approved' | 'correction'
}) {
  try {
    const { payload, user } = await getServerAuth()
    if (!user) return { success: false }

    await payload.create({
      collection: 'deliverables',
      data: {
        name: data.name,
        url: data.url,
        type: 'link',
        space: data.spaceId,
        status: data.status || 'pending',
        createdBy: user.id,
      },
    })

    const updatedDeliverables = await getDeliverables(data.spaceId, 1)
    revalidatePath(`/spaces/${data.spaceId}/deliverables`)
    return {
      success: true,
      deliverables: updatedDeliverables,
    }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}

export async function createFileDeliverable(data: {
  name: string
  file: File
  spaceId: number
  status?: 'pending' | 'approved' | 'correction'
}) {
  try {
    const { payload, user } = await getServerAuth()
    if (!user) return { success: false }

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
      collection: 'deliverables',
      data: {
        name: data.name,
        type: 'file',
        space: data.spaceId,
        attachment: file.id,
        status: data.status || 'pending',
        createdBy: user.id,
      },
    })

    const updatedDeliverables = await getDeliverables(data.spaceId, 1)
    revalidatePath(`/spaces/${data.spaceId}/deliverables`)
    return {
      success: true,
      deliverables: updatedDeliverables,
    }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}

export async function updateDeliverableStatus(
  id: number,
  status: 'pending' | 'approved' | 'correction',
  statusComment?: string,
) {
  try {
    const { payload, user } = await getServerAuth()
    if (!user) return { success: false }

    await payload.update({
      collection: 'deliverables',
      id,
      data: {
        status,
        statusComment: status === 'correction' ? statusComment : undefined,
      },
    })

    const deliverable = await payload.findByID({
      collection: 'deliverables',
      id,
      overrideAccess: false,
      user,
    })

    const spaceId = typeof deliverable.space === 'object' ? deliverable.space.id : deliverable.space
    revalidatePath(`/spaces/${spaceId}/deliverables`)

    return {
      success: true,
      message: 'Status updated successfully',
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Failed to update status',
    }
  }
}

export async function deleteDeliverable(id: number, spaceId: string, currentPage: number = 1) {
  try {
    const { payload } = await getServerAuth()

    await payload.delete({
      collection: 'deliverables',
      id,
    })

    const updatedDeliverables = await getDeliverables(spaceId, currentPage)
    revalidatePath(`/spaces/${spaceId}/deliverables`)
    return {
      message: 'Deliverable deleted successfully',
      success: true,
      deliverables: updatedDeliverables,
    }
  } catch (error) {
    console.error(error)
    return { message: 'Error deleting deliverable', success: false }
  }
}

export async function trackDeliverableView(id: number) {
  try {
    const { payload, user } = await getServerAuth()
    if (!user || user.role === 'admin') return

    const deliverable = await payload.findByID({
      collection: 'deliverables',
      id,
      overrideAccess: false,
      user,
    })

    if (!deliverable) return

    // Check if user has already viewed this deliverable
    const hasViewed = asManyRel(deliverable.views).some(
      (view) => (isRel(view.user) ? view.user.id : view.user) === user.id,
    )

    // Only add view if user hasn't viewed it before
    if (!hasViewed) {
      await payload.update({
        collection: 'deliverables',
        id,
        data: {
          views: [
            ...(deliverable.views || []),
            {
              user: user.id,
              viewedAt: new Date().toISOString(),
            },
          ],
        },
      })
      revalidatePath(`/spaces/${deliverable.space}/deliverables`)
    }
  } catch (error) {
    console.error('Failed to track view:', error)
  }
}
