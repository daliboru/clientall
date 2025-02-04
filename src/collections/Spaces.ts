import type { CollectionConfig } from 'payload'
import { Space } from '../payload-types'

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
      name: 'administrators',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      access: {
        read: async ({ req: { user }, doc }) => {
          if (!user) return false
          if (user.role === 'admin') return true

          if (doc) {
            return doc.administrators.includes(user.id)
          }
        },
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
      hooks: {
        afterChange: [
          async ({ req, value: newAdminIds, previousValue: oldAdminIds, originalDoc }) => {
            const payload = req.payload

            const addedAdmins =
              newAdminIds?.filter((newAdminId: number) => !oldAdminIds?.includes(newAdminId)) || []
            const removedAdmins =
              oldAdminIds?.filter((oldAdminId: number) => !newAdminIds?.includes(oldAdminId)) || []

            // Add space to added admins
            await Promise.all(
              addedAdmins.map(async (userId: number) => {
                const user = await payload.findByID({
                  collection: 'users',
                  id: userId,
                })

                await payload.update({
                  collection: 'users',
                  id: userId,
                  data: {
                    spaces: [...(user.spaces || []), originalDoc.id],
                  },
                })
              }),
            )

            // Remove space from removed admins
            await Promise.all(
              removedAdmins.map(async (userId: number) => {
                const user = await payload.findByID({
                  collection: 'users',
                  id: userId,
                })

                await payload.update({
                  collection: 'users',
                  id: userId,
                  data: {
                    spaces: (user.spaces as Space[])?.filter(
                      (space: Space) => space.id !== originalDoc.id,
                    ),
                  },
                })
              }),
            )
          },
        ],
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
