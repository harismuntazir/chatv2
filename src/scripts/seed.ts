import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({
  path: path.resolve(dirname, '../../.env'),
})

// Ensure secret is available before config import
if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is missing from .env')
}

import configPromise from '@payload-config'
import { getPayload } from 'payload'

const seed = async () => {
  console.error('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? 'Loaded' : 'Missing')
  
  const payload = await getPayload({ config: configPromise })

  console.error('Clearing existing data...')
  await payload.delete({ collection: 'users', where: {} })
  await payload.delete({ collection: 'roles', where: {} })

  console.error('Creating roles...')
  const adminRole = await payload.create({
    collection: 'roles',
    data: { name: 'Admin', slug: 'admin' },
  })
  const supportRole = await payload.create({
    collection: 'roles',
    data: { name: 'Support', slug: 'support' },
  })
  const candidateRole = await payload.create({
    collection: 'roles',
    data: { name: 'Candidate', slug: 'candidate' },
  })

  console.error('Creating users...')
  // Admin
  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@test.com',
      password: 'password',
      roles: [adminRole.id],
    },
  })

  // Support
  await payload.create({
    collection: 'users',
    data: {
      email: 'support@test.com',
      password: 'password',
      roles: [supportRole.id],
    },
  })
  await payload.create({
    collection: 'users',
    data: {
      email: 'support2@test.com',
      password: 'password',
      roles: [supportRole.id],
    },
  })

  // Candidates (Users)
  await payload.create({
    collection: 'users',
    data: {
      email: 'candidate@test.com',
      password: 'password',
      roles: [candidateRole.id],
    },
  })
  await payload.create({
    collection: 'users',
    data: {
      email: 'candidate2@test.com',
      password: 'password',
      roles: [candidateRole.id],
    },
  })



  console.error('Seed completed successfully.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
