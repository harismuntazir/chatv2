import { Socket } from 'socket.io'
import jwt from 'jsonwebtoken'

export const authMiddleware = (socket: Socket, next: (err?: any) => void) => {
  const token = socket.handshake.auth.token

  if (!token) {
    // Allow anonymous connection (for candidates)
    return next()
  }

  try {
    const secret = process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE' // Ensure this matches Payload secret
    const decoded = jwt.verify(token, secret) as any
    socket.data.user = decoded
    next()
  } catch (err) {
    // If token is invalid, still allow connection but without user data?
    // Or fail? For now, let's allow it as anonymous to prevent blocking.
    console.warn('Socket auth failed, proceeding as anonymous')
    next()
  }
}
