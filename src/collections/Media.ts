import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  disableDuplicate: true,
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
    // This kinda works but creates problems...
    // beforeChange: [
    //   async ({ data }) => {
    //     // Add the prefix (folder) to the filename
    //     if (data.filename) {
    //       data.filename = `images/${data.filename}` // 'images' is the folder name
    //     }
    //     return data
    //   },
    // ],
    // beforeRead: [
    //   async ({ doc }) => {
    //     // Remove the prefix (folder) from the filename
    //     if (doc.filename) {
    //       doc.filename = doc.filename.replace('images/', '') // 'images' is the folder name
    //     }
    //     return doc
    //   },
    // ],
  },
}
