import { CollectionConfig } from 'payload'

export const Candidates: CollectionConfig = {
  slug: 'candidates',
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    // Add other candidate fields here
  ],
}
