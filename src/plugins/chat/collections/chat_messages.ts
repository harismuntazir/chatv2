import { CollectionConfig } from 'payload'

export const ChatMessages: CollectionConfig = {
  slug: 'chat_messages',
  access: {
    read: () => true,
    create: () => true,
    update: () => false, // Messages should be immutable usually
  },
  fields: [
    {
      name: 'conversation',
      type: 'relationship',
      relationTo: 'conversations',
      required: true,
      index: true,
    },
    {
      name: 'from',
      type: 'relationship',
      relationTo: ['users', 'candidates'],
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Candidate', value: 'candidate' },
        { label: 'Support', value: 'support' },
        { label: 'System', value: 'system' },
      ],
      required: true,
    },
    {
      name: 'text',
      type: 'textarea',
    },
    {
      name: 'attachments',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: ['sent', 'delivered', 'read'],
      defaultValue: 'sent',
    },
    {
      name: 'meta',
      type: 'json',
    },
  ],
  timestamps: true,
}
