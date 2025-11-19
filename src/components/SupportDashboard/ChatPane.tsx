'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useChatSocket } from '../ChatWidget/useChatSocket'

interface ChatPaneProps {
  conversationId: string
}

export const ChatPane: React.FC<ChatPaneProps> = ({ conversationId }) => {
  const [messages, setMessages] = useState<any[]>([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [socket, setSocket] = useState<any>(null)

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

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:38120'
    const { io } = require('socket.io-client')
    const newSocket = io(socketUrl, {
      transports: ['websocket'],
    })

    newSocket.on('connect', () => {
      newSocket.emit('joinChat', { conversationId })
    })

    newSocket.on('message', (msg: any) => {
      setMessages((prev) => [...prev, msg])
    })

    setSocket(newSocket)

    return () => newSocket.disconnect()
  }, [conversationId])

  const handleSendReply = () => {
    if (!socket || !inputValue.trim()) return

    socket.emit('message', {
      conversationId,
      text: inputValue,
    })
    setInputValue('')
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100">
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[70%] ${
              msg.role === 'support' ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            <div
              className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                msg.role === 'support'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 px-1">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200 flex gap-3 items-end">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendReply())
          }
          placeholder="Type a reply..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-14 text-sm"
        />
        <button
          onClick={handleSendReply}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors h-14 flex items-center"
        >
          Send
        </button>
      </div>
    </div>
  )
}
