import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
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

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

;(async () => {
  const pubClient = createClient({ url: REDIS_URL })
  const subClient = pubClient.duplicate()

  await Promise.all([pubClient.connect(), subClient.connect()])

  io.adapter(createAdapter(pubClient, subClient))

  io.use(authMiddleware)

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.user?.id}`)

    socket.on('joinChat', ({ conversationId }) => {
      // TODO: Verify user access to conversation
      socket.join(`chat:${conversationId}`)
      console.log(`User ${socket.data.user?.id} joined chat:${conversationId}`)
    })

    socket.on('message', (payload) => messageHandler(io, socket, payload))

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })

  const PORT = process.env.SOCKET_PORT || 4001
  httpServer.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`)
  })
})()
