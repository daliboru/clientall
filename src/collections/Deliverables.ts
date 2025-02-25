import { asManyRel, isRel } from '@/lib/payload-utils'
import { Resource, User } from '@/payload-types'
import type { CollectionConfig } from 'payload'

export const Deliverables: CollectionConfig = {
  slug: 'deliverables',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'File', value: 'file' },
        { label: 'Link', value: 'link' },
      ],
    },
    {
      name: 'attachment',
      label: 'Attachment',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data.type === 'file',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (data) => data.type === 'link',
        description: 'e.g. https://google.com',
      },
      validate: (
        value: string | undefined | null | string[],
        { data }: { data: Partial<Resource> },
      ) => {
        if (data.type !== 'link') {
          return true
        }

        if (!value || typeof value === 'object') {
          return 'URL is required when type is link'
        }

        try {
          new URL(value)
          return true
        } catch {
          return 'Please enter a valid URL'
        }
      },
    },
    {
      name: 'space',
      type: 'relationship',
      relationTo: 'spaces',
      required: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      },
      defaultValue: ({ user }) => user?.id,
      maxDepth: 2,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Needs Correction', value: 'correction' },
      ],
    },
    {
      name: 'statusComment',
      type: 'textarea',
      admin: {
        condition: (data) => data.status === 'correction',
      },
    },
    {
      name: 'views',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'viewedAt',
          type: 'date',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Handle file/link type changes
        if (data.type === 'file' && data.url) {
          data.url = undefined
        }
        if (data.type === 'link' && data.file) {
          data.file = undefined
        }

        if (data.views?.length > 0) {
          const seenUsers = new Set()
          data.views = asManyRel<{
            user: User | number
            viewedAt: Date
          }>(data.views).filter((view) => {
            const userId = isRel(view.user) ? view.user.id : view.user
            if (seenUsers.has(userId)) {
              return false
            }
            seenUsers.add(userId)
            return true
          })
        }

        return data
      },
    ],
  },
  access: {
    read: async ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true

      // Extract space IDs from user's spaces array
      const spaceIds =
        user.relatedSpaces?.docs?.map((space) => (typeof space === 'object' ? space.id : space)) ||
        []

      if (!spaceIds.length) {
        return false
      }

      return {
        space: {
          in: spaceIds,
        },
      }
    },
    create: async ({ req }) => {
      if (!req.user) return false
      return true
    },
    update: async ({ req, id }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true

      if (!id) return false

      const doc = await req.payload.findByID({
        collection: 'resources',
        id,
        overrideAccess: false,
        user: req.user,
      })

      if (!doc) return false

      const space = await req.payload.findByID({
        collection: 'spaces',
        id: isRel(doc.space) ? doc.space.id : doc.space,
        overrideAccess: false,
        user: req.user,
      })

      if (!space) return false

      return (
        space.owner === req.user.id ||
        asManyRel<User>(space.members).some((member) => member.id === req.user?.id)
      )
    },
    delete: async ({ req, id }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true

      if (!id) return false

      const doc = await req.payload.findByID({
        collection: 'resources',
        id,
        overrideAccess: false,
        user: req.user,
      })

      if (!doc) return false

      const space = await req.payload.findByID({
        collection: 'spaces',
        id: typeof doc.space === 'object' ? doc.space.id : doc.space,
        overrideAccess: false,
        user: req.user,
      })

      if (!space) return false

      return (
        space.owner === req.user.id ||
        asManyRel<User>(space.members).some((member) => member.id === req.user?.id)
      )
    },
  },
}
