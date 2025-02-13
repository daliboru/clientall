import type { CollectionConfig } from 'payload'
import { asManyRel } from '../lib/payload-utils'
import { User } from '../payload-types'

export const Resources: CollectionConfig = {
  slug: 'resources',
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
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: false,
      unique: true,
      admin: {
        condition: (data) => data.type === 'file',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: false,
      admin: {
        condition: (data) => data.type === 'link',
      },
      // TODO:
      // validate: (value, { data }) => {
      //   if (data.type === 'link' && !value) {
      //     return 'URL is required for link resources'
      //   }
      //   return true
      // },
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
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.type === 'file' && data.url) {
          data.url = undefined
        }
        if (data.type === 'link' && data.file) {
          data.file = undefined
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
      })

      if (!doc) return false

      const space = await req.payload.findByID({
        collection: 'spaces',
        id: typeof doc.space === 'object' ? doc.space.id : doc.space,
      })

      if (!space) return false

      return asManyRel<User>(space.administrators).some((admin) => admin.id === req.user?.id)
    },
    delete: async ({ req, id }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true

      if (!id) return false

      const doc = await req.payload.findByID({
        collection: 'resources',
        id,
      })

      if (!doc) return false

      const space = await req.payload.findByID({
        collection: 'spaces',
        id: typeof doc.space === 'object' ? doc.space.id : doc.space,
      })

      if (!space) return false

      return asManyRel<User>(space.administrators).some((admin) => admin.id === req.user?.id)
    },
  },
}
