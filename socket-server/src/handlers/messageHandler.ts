import { Server, Socket } from 'socket.io'

export const messageHandler = async (io: Server, socket: Socket, payload: any) => {
  const { conversationId, text, meta, attachments } = payload
  let user = socket.data.user

  const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'

  // If no user (anonymous socket), try to infer from conversation
  let senderId = user?.id
  let senderRole = user?.roles?.some((r: any) => r.slug === 'candidate') ? 'candidate' : 'support'

  if (!user) {
    try {
      // Fetch conversation to find the candidate
      const convRes = await fetch(`${PAYLOAD_URL}/api/conversations/${conversationId}`)
      if (convRes.ok) {
        const conv = await convRes.json()
        // Assume unauthenticated user is the candidate of this conversation
        senderId = typeof conv.candidate === 'object' ? conv.candidate.id : conv.candidate
        senderRole = 'candidate'
      }
    } catch (err) {
      console.error('Failed to fetch conversation for auth inference', err)
      return
    }
  }

  if (!senderId) {
    console.error('Could not identify sender')
    return
  }

  // 2. Persist message via Payload REST API
  try {
    // Normalise attachments either from top-level `attachments` or `meta.attachments` and convert to Payload shape
    const attachmentIds = attachments || (meta && meta.attachments) || []
    const attachmentsForDb = Array.isArray(attachmentIds)
      ? attachmentIds.map((id: string) => ({ file: id }))
      : []

    // Simplified persistence for MVP:
    const response = await fetch(`${PAYLOAD_URL}/api/chat_messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation: conversationId,
        from: senderId,
        role: senderRole,
        text,
        attachments: attachmentsForDb,
        meta,
        status: 'sent',
      }),
    })

    if (!response.ok) {
      console.error('Failed to persist message', await response.text())
      return
    }

    const savedMessage = await response.json()

    // Try to fetch a populated version of the saved message (so clients get file urls & metadata)
    let messageToEmit = savedMessage.doc
    try {
      const fetchRes = await fetch(
        `${PAYLOAD_URL}/api/chat_messages/${savedMessage.doc.id}?depth=1`,
      )
      if (fetchRes.ok) {
        const fetched = await fetchRes.json()
        if (fetched && fetched.doc) {
          messageToEmit = fetched.doc
        }
      }
    } catch (err) {
      // Ignore — fallback to savedMessage.doc if we couldn't populate.
      console.error('Failed to fetch populated message', err)
    }

    // 3. Emit to room
    io.to(`chat:${conversationId}`).emit('message', messageToEmit)

    // 4. Notify support dashboard
    io.to('support').emit('conversationUpdated', {
      conversationId,
      lastMessage: savedMessage.doc,
      unreadCount: 1, // Simplified: In real app, calculate actual unread count
    })
  } catch (error) {
    console.error('Error handling message:', error)
  }
}
