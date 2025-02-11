import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
// import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Notes } from './collections/Notes'
import { Spaces } from './collections/Spaces'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  debug: process.env.NODE_ENV === 'development',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  collections: [Users, Media, Spaces, Notes],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  sharp,
  // email: nodemailerAdapter({
  //   defaultFromName: 'Clientall App',
  //   defaultFromAddress: 'info@clientallapp.com',
  // }),
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
