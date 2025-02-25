import type { CollectionConfig } from 'payload'
import { isRel } from '../lib/payload-utils'

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
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'relatedResources',
      type: 'join',
      on: 'space',
      collection: 'resources',
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      defaultValue: ({ user }) => user?.id,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      maxDepth: 2,
      defaultValue: ({ user }) => user?.id,
      access: {
        update: async ({ req: { user }, doc }) => {
          if (!user) return false
          if (user.role === 'admin') return true
          return doc?.owner === user.id
        },
      },
    },
  ],
  access: {
    read: async ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true

      return {
        members: {
          contains: isRel(req.user) ? req.user.id : req.user,
        },
      }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user }, data }) => {
      if (!user) return false
      if (user.role === 'admin') return true

      return {
        owner: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true

      return {
        owner: {
          equals: user.id,
        },
      }
    },
  },
  hooks: {
    beforeDelete: [
      async ({ req }) => {
        // Delete all related notes
        const notes = await req.payload.find({
          collection: 'notes',
          overrideAccess: false,
          user: req.user,
        })

        for (const note of notes.docs) {
          await req.payload.delete({
            collection: 'notes',
            id: note.id,
            user: req.user,
          })
        }

        // Delete all related resources
        const resources = await req.payload.find({
          collection: 'resources',
          overrideAccess: false,
          user: req.user,
        })

        for (const resource of resources.docs) {
          await req.payload.delete({
            collection: 'resources',
            id: resource.id,
            user: req.user,
          })
        }

        // Delete all related deliverables
        const deliverables = await req.payload.find({
          collection: 'deliverables',
          overrideAccess: false,
          user: req.user,
        })

        for (const deliverable of deliverables.docs) {
          await req.payload.delete({
            collection: 'deliverables',
            id: deliverable.id,
            user: req.user,
          })
        }
      },
    ],
  },
}
