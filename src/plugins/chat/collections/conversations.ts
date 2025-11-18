import { CollectionConfig } from 'payload'

export const Conversations: CollectionConfig = {
  slug: 'conversations',
  access: {
    read: () => true, // TODO: Restrict to participants
    create: () => true, // TODO: Restrict
    update: () => true, // TODO: Restrict
  },
  fields: [
    {
      name: 'candidate',
      type: 'relationship',
      relationTo: 'candidates',
      required: true,
    },
    {
      name: 'assignedSupport',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'status',
      type: 'select',
      options: ['open', 'pending', 'resolved'],
      defaultValue: 'open',
    },
    {
      name: 'unreadByCandidate',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'unreadBySupport',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'lastMessageAt',
      type: 'date',
    },
    {
      name: 'notifications',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'pendingNotifications',
      type: 'array',
      fields: [
        {
          name: 'scheduledAt',
          type: 'date',
        },
        {
          name: 'status',
          type: 'select',
          options: ['pending', 'sent', 'failed'],
          defaultValue: 'pending',
        },
      ],
    },
  ],
  timestamps: true,
}
