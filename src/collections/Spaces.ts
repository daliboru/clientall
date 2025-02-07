import type { CollectionConfig } from 'payload'

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
      name: 'administrators',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      maxDepth: 2,
      access: {
        update: async ({ req: { user }, doc }) => {
          if (!user) return false
          if (user.role === 'admin') return true

          // Check if user is the first administrator (owner)
          if (doc) return doc.administrators[0] === user.id

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
