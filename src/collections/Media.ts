import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    staticDir: 'media',
    mimeTypes: ['image/*'],
    formatOptions: {
      format: 'webp',
      options: {
        quality: 75,
      },
    },
    resizeOptions: {
      width: 1200,
      height: 1200,
      fit: 'inside',
    },
  },
  hooks: {
    beforeOperation: [
      ({ req, operation }) => {
        if ((operation === 'create' || operation === 'update') && req.file) {
          req.file.name = `${req.user?.name?.toLowerCase().replace(/\s+/g, '-')}-avatar`
        }
      },
    ],
    beforeChange: [
      ({ req, data }) => {
        data.alt = req.user?.name
      },
    ],
  },
}
