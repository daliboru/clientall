import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      defaultValue: '',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Client',
          value: 'client',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Customer',
          value: 'customer',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'avatar',
      label: 'Avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'spaces',
      type: 'relationship',
      hasMany: true,
      relationTo: 'spaces',
      defaultValue: [],
      admin: {
        readOnly: true, // This field should only be modified through the Space collection
        description: 'Spaces are automatically assigned when added as an administrator',
      },
      access: {
        create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'customer',
        update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'customer',
      },
    },
  ],
  access: {
    read: async ({ req }) => {
      if (!req.user) {
        return false
      }

      if (req.user.role.includes('admin')) {
        return true
      }

      return {
        id: {
          equals: req.user.id,
        },
      }
    },
    create: async ({ req }) => {
      if (!req.user) {
        return false
      }

      if (req.user.role.includes('admin')) {
        return true
      }

      return false
    },
    update: async ({ req }) => {
      if (!req.user) {
        return false
      }

      if (req.user.role.includes('admin')) {
        return true
      }

      return {
        id: {
          equals: req.user.id,
        },
      }
    },
    delete: async ({ req }) => {
      if (!req.user) {
        return false
      }

      if (req.user.role.includes('admin')) {
        return true
      }

      return {
        id: {
          equals: req.user.id,
        },
      }
    },
  },
}
