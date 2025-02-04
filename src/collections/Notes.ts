import type { CollectionConfig } from 'payload'

export const Notes: CollectionConfig = {
  slug: 'notes',
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'space',
      type: 'relationship',
      relationTo: 'spaces',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          async ({ req, value }) => {
            if (!req.user) {
              throw new Error('You must be logged in to create a note')
            }

            const space = await req.payload.findByID({
              collection: 'spaces',
              id: value,
              depth: 0,
            })

            if (!space.administrators.includes(req.user.id)) {
              throw new Error('You do not have access to this space')
            }

            return value
          },
        ],
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [({ req }) => req.user?.id],
      },
    },
  ],
  access: {
    read: async ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        space: {
          in: user.spaces,
        },
      }
    },
  },
  endpoints: [
    {
      path: '/:id/notes',
      method: 'get',
      handler: async ({ query, payload, user }) => {
        const spaceId = query.id as string

        if (!user) {
          return Response.json({ error: 'You must be logged in to view notes' }, { status: 401 })
        }

        try {
          const space = await payload.findByID({
            collection: 'spaces',
            id: spaceId,
          })

          if (!space.administrators.includes(user.id)) {
            return Response.json({ error: 'You do not have access to this space' }, { status: 403 })
          }

          // Get resources
          const resources = await payload.find({
            collection: 'notes',
            where: {
              space: {
                equals: spaceId,
              },
            },
            sort: '-createdAt',
          })

          return Response.json(resources)
        } catch (_error) {
          return Response.json({ error: 'Space not found' }, { status: 404 })
        }
      },
    },
  ],
}
