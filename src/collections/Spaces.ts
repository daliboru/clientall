import type { CollectionConfig } from 'payload'
import { asManyRel } from '../lib/payload-utils'
import { User } from '../payload-types'

export const Spaces: CollectionConfig = {
  slug: 'spaces',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      defaultValue: '',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
      defaultValue: '',
    },
    {
      name: 'relatedNotes',
      type: 'join',
      on: 'space',
      collection: 'notes',
    },
    {
      name: 'relatedResources',
      type: 'join',
      on: 'space',
      collection: 'resources',
    },
    {
      name: 'administrators',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      maxDepth: 2,
      access: {
        update: async ({ req: { user }, doc }) => {
          if (!user) return false

          // Admin can update any space
          if (user.role === 'admin') return true

          if (doc && Array.isArray(doc.administrators)) {
            return asManyRel<User>(doc.administrators)
              .filter((user) => user.role === 'customer')
              .some((admin) => admin.id === user.id)
          }

          return false
        },
        create: async ({ req: { user } }) => {
          if (!user) return false
          return user.role === 'admin' || user.role === 'customer'
        },
      },
    },
  ],
  access: {
    read: async ({ req }) => {
      if (!req.user) return false

      if (req.user.role === 'admin') return true

      return {
        administrators: {
          contains: req.user.id,
        },
      }
    },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'customer',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'customer',
    delete: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'customer',
  },
}
