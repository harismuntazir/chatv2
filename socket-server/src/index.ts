import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { authMiddleware } from './auth'
import { messageHandler } from './handlers/messageHandler'

dotenv.config()

const app = express()
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*', // TODO: Restrict in production
    methods: ['GET', 'POST'],
  },
})

console.log('Socket.IO server starting with in-memory adapter')

;(async () => {

  io.use(authMiddleware)

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.user?.id}`)

    socket.on('joinChat', ({ conversationId }) => {
      // TODO: Verify user access to conversation
      socket.join(`chat:${conversationId}`)
      console.log(`User ${socket.data.user?.id} joined chat:${conversationId}`)
    })

    socket.on('joinSupport', () => {
      // Allow any authenticated user (or check for support role specifically)
      if (socket.data.user) {
        socket.join('support')
        console.log(`User ${socket.data.user.id} joined support channel`)
      }
    })

    socket.on('message', (payload) => messageHandler(io, socket, payload))

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })

  const PORT = process.env.SOCKET_PORT || 38120
  httpServer.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`)
  })
})()
