import { Server, Socket } from 'socket.io'

export const messageHandler = async (io: Server, socket: Socket, payload: any) => {
  const { conversationId, text, meta } = payload
  const user = socket.data.user

  if (!user) return

  // 1. Validate (Optional: call Payload API to verify access if not trusted)

  // 2. Persist message via Payload REST API
  try {
    const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'
    const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET // Use a server-to-server token or API key if available

    // For now, we assume we can post as the user or use a system token.
    // Ideally, we use a system API key to create the message on behalf of the user.
    // Or we just forward the user's token if it's valid for the API.
    
    // Simplified persistence for MVP:
    const response = await fetch(`${PAYLOAD_URL}/api/chat_messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // We need a token here.
      },
      body: JSON.stringify({
        conversation: conversationId,
        from: user.id,
        role: user.collection === 'candidates' ? 'candidate' : 'support', // Infer role
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
