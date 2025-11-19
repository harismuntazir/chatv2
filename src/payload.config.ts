// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Roles } from './collections/Roles'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { chatPlugin } from './plugins/chat'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Roles],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  onInit: async (payload) => {
    console.log('Payload Config Secret Prefix:', (process.env.PAYLOAD_SECRET || '').substring(0, 5))
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    chatPlugin,
    // storage-adapter-placeholder
  ],
})
