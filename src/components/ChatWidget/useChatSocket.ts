import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseChatSocketProps {
  token?: string
  onMessage?: (message: any) => void
}

export const useChatSocket = ({ token, onMessage }: UseChatSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)

  useEffect(() => {
    // Fetch widget config to get socket URL and conversation ID
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/chat/widget-config')
        const config = await res.json()
        
        console.log('Chat config fetched:', config)
        
        // Also try to create/get conversation
        // In a real app, we might wait for user action, but for widget we often auto-create or fetch existing
        const chatRes = await fetch('/api/chat/create', { 
          method: 'POST',
          credentials: 'include', // Important: Send cookies so API knows who we are
        })
        const chat = await chatRes.json()
        console.log('Chat conversation:', chat)
        
        if (chat.id) {
          setConversationId(chat.id)
          connectSocket(config.socketUrl, chat.id)
        }
      } catch (err) {
        console.error('Failed to init chat', err)
      }
    }

    fetchConfig()

    return () => {
      if (socket) socket.disconnect()
    }
  }, [])

  const connectSocket = (url: string, chatId: string) => {
    let socketToken = token
    if (!socketToken) {
      const Cookies = require('js-cookie')
      socketToken = Cookies.get('payload-token')
    }

    const newSocket = io(url, {
      auth: { token: socketToken },
      transports: ['websocket'],
    })

    console.log('Connecting to socket:', url)

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
      setIsConnected(true)
      newSocket.emit('joinChat', { conversationId: chatId })
    })

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    newSocket.on('message', (msg: any) => {
      if (onMessage) onMessage(msg)
    })

    setSocket(newSocket)
  }

  const sendMessage = (text: string, meta?: any) => {
    if (socket && conversationId) {
      socket.emit('message', {
        conversationId,
        text,
        meta,
      })
    }
  }

  return { socket, isConnected, sendMessage, conversationId }
}
