import { Server, Socket } from 'socket.io'

export const messageHandler = async (io: Server, socket: Socket, payload: any) => {
  const { conversationId, text, meta } = payload
  let user = socket.data.user

  const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'
  
  // If no user (anonymous socket), try to infer from conversation
  let senderId = user?.id
  let senderRole = user?.collection === 'candidates' ? 'candidate' : 'support'

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
    // Simplified persistence for MVP:
    const response = await fetch(`${PAYLOAD_URL}/api/chat_messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation: conversationId,
        from: {
          value: senderId,
          relationTo: senderRole === 'candidate' ? 'candidates' : 'users',
        },
        role: senderRole,
        text,
        meta,
        status: 'sent',
      }),
    })

    if (!response.ok) {
      console.error('Failed to persist message', await response.text())
      return
    }

    const savedMessage = await response.json()

    // 3. Emit to room
    io.to(`chat:${conversationId}`).emit('message', savedMessage.doc)

  } catch (error) {
    console.error('Error handling message:', error)
  }
}
