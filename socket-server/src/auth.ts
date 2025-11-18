import { Socket } from 'socket.io'
import jwt from 'jsonwebtoken'

export const authMiddleware = (socket: Socket, next: (err?: any) => void) => {
  const token = socket.handshake.auth.token

  if (!token) {
    return next(new Error('Authentication error'))
  }

  try {
    const secret = process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE' // Ensure this matches Payload secret
    const decoded = jwt.verify(token, secret) as any
    socket.data.user = decoded
    next()
  } catch (err) {
    next(new Error('Authentication error'))
  }
}
