import { Endpoint } from 'payload'

export const chatEndpoints: Endpoint[] = [
  {
    path: '/chat/widget-config',
    method: 'get',
    handler: async (req) => {
      // In a real app, we'd get the user from req.user
      // and find their active conversation.
      // For MVP, we'll just return the socket URL.
      return Response.json({
        socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:38120',
      })
    },
  },
  {
    path: '/chat/create',
    method: 'post',
    handler: async (req) => {
      const { payload, user } = req
      if (!user) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const body = await req.json().catch(() => ({}))
      const candidateId = body.candidateId || user.id

      // Check if conversation exists
      const existing = await payload.find({
        collection: 'conversations',
        where: {
          candidate: {
            equals: candidateId,
          },
          status: {
            not_equals: 'resolved',
          },
        },
      })

      if (existing.totalDocs > 0) {
        return Response.json(existing.docs[0])
      }

      // Create new
      const newConversation = await payload.create({
        collection: 'conversations',
        data: {
          candidate: candidateId,
          status: 'open',
          lastMessageAt: new Date().toISOString(),
        },
      })

      return Response.json(newConversation)
    },
  },
  {
    path: '/chat/support-dashboard',
    method: 'get',
    handler: async (req) => {
      const { payload, user } = req
      // Verify support role (omitted for MVP simplicity, assuming all logged in users can see for now or handled by access control)
      if (!user) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const conversations = await payload.find({
        collection: 'conversations',
        sort: '-lastMessageAt',
        limit: 50,
      })

      return Response.json(conversations)
    },
  },
]
