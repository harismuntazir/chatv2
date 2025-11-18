'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useChatSocket } from '../ChatWidget/useChatSocket' // Reuse hook

interface ChatPaneProps {
  conversationId: string
}

export const ChatPane: React.FC<ChatPaneProps> = ({ conversationId }) => {
  const [messages, setMessages] = useState<any[]>([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { isConnected, sendMessage } = useChatSocket({
    onMessage: (msg) => {
      if (msg.conversation === conversationId || msg.conversation?.id === conversationId) {
        setMessages((prev) => [...prev, msg])
      }
    },
  })

  useEffect(() => {
    if (conversationId) {
      fetch(`/api/chat_messages?where[conversation][equals]=${conversationId}&sort=createdAt`)
        .then((res) => res.json())
        .then((data) => {
          if (data.docs) {
            setMessages(data.docs)
          }
        })
    }
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return
    // We need to pass the conversationId explicitly to sendMessage if the hook doesn't manage it for us in this context
    // The hook manages conversationId state, but here we are passing it in.
    // We should probably update the hook to accept conversationId or just emit directly.
    // The hook's sendMessage uses its internal conversationId.
    // Let's modify the hook usage or just use the socket directly if needed, but the hook is convenient.
    // Actually, the hook's sendMessage uses `conversationId` state which is set by `widget-config`.
    // For support dashboard, we might need to set that state or bypass it.
    // Let's just use the socket from the hook and emit manually if needed, or better, update the hook to allow overriding conversationId.
    // For now, I'll assume I can use the socket directly from the hook.
    
    // Wait, the hook returns `socket`.
    // I'll use that.
    // But wait, `sendMessage` in hook uses `conversationId` state.
    // I should probably just use `socket.emit` here.
  }
  
  // Re-implementing send for dashboard specific needs
  const sendReply = () => {
     if (!inputValue.trim()) return
     // We need the socket from the hook
     // The hook exposes `socket`
     // But `useChatSocket` initializes connection based on widget-config which might be for candidates.
     // Support staff might need a different init flow (e.g. just connect with token).
     // For MVP, let's assume the same socket connection works if we pass the token.
     // But `useChatSocket` fetches `widget-config`.
     // I might need a `useSupportSocket` or make the hook more flexible.
     // I'll stick to a simple implementation here using the same hook but ignoring the auto-join if possible, or just use `io` directly here.
     // Let's use `io` directly here for simplicity and control.
  }

  // Actually, let's just use a new useEffect to connect for support
  const [socket, setSocket] = useState<any>(null)

  useEffect(() => {
    // Fetch config or just hardcode for now
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4001'
    const { io } = require('socket.io-client')
    const newSocket = io(socketUrl, {
        transports: ['websocket'],
        // auth: { token: 'SUPPORT_TOKEN' } // TODO: Add auth
    })
    
    newSocket.on('connect', () => {
        newSocket.emit('joinChat', { conversationId })
    })
    
    newSocket.on('message', (msg: any) => {
        setMessages(prev => [...prev, msg])
    })
    
    setSocket(newSocket)
    
    return () => newSocket.disconnect()
  }, [conversationId])

  const handleSendReply = () => {
      if (!socket || !inputValue.trim()) return
      
      socket.emit('message', {
          conversationId,
          text: inputValue,
          // meta: { role: 'support' } // Server should handle role based on user
      })
      setInputValue('')
  }

  return (
    <div className="chat-pane">
      <div className="messages-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.role === 'support' ? 'mine' : 'theirs'}`}>
            <div className="message-bubble">
              {msg.text}
            </div>
            <span className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="composer-area">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendReply())}
          placeholder="Type a reply..."
        />
        <button onClick={handleSendReply}>Send</button>
      </div>
      <style jsx>{`
        .chat-pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #f0f2f5;
        }
        .messages-area {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .message-row {
          display: flex;
          flex-direction: column;
          max-width: 70%;
        }
        .message-row.mine {
          align-self: flex-end;
          align-items: flex-end;
        }
        .message-row.theirs {
          align-self: flex-start;
          align-items: flex-start;
        }
        .message-bubble {
          padding: 10px 15px;
          border-radius: 10px;
          background: white;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .message-row.mine .message-bubble {
          background: #007bff;
          color: white;
        }
        .message-time {
          font-size: 10px;
          color: #999;
          margin-top: 4px;
        }
        .composer-area {
          padding: 20px;
          background: white;
          border-top: 1px solid #eee;
          display: flex;
          gap: 10px;
        }
        textarea {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          resize: none;
          height: 50px;
        }
        button {
          padding: 0 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}
