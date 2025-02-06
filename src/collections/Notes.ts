import type { CollectionConfig } from 'payload'

export const Notes: CollectionConfig = {
  slug: 'notes',
  defaultPopulate: {
    content: true,
    createdBy: true,
    createdAt: true,
  },
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
      maxDepth: 0,
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
      maxDepth: 2,
    },
  ],
  access: {
    read: async ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true

      // Extract space IDs from user's spaces array
      const spaceIds =
        user.spaces?.map((space) => (typeof space === 'object' ? space.id : space)) || []

      return {
        space: {
          in: spaceIds,
        },
      }
    },
  },
  // endpoints: [
  //   {
  //     path: 'spaces/:id/notes',
  //     method: 'get',
  //     handler: async ({ query, payload, user }) => {
  //       const spaceId = query.id as string

  //       if (!user) {
  //         return Response.json({ error: 'You must be logged in to view notes' }, { status: 401 })
  //       }

  //       try {
  //         const space = await payload.findByID({
  //           collection: 'spaces',
  //           id: spaceId,
  //         })

  //         if (!space.administrators.includes(user.id)) {
  //           return Response.json({ error: 'You do not have access to this space' }, { status: 403 })
  //         }

  //         // Get resources
  //         const resources = await payload.find({
  //           collection: 'notes',
  //           where: {
  //             space: {
  //               equals: spaceId,
  //             },
  //           },
  //           sort: '-createdAt',
  //         })

  //         return Response.json(resources)
  //       } catch (_error) {
  //         return Response.json({ error: 'Space not found' }, { status: 404 })
  //       }
  //     },
  //   },
  // ],
}
