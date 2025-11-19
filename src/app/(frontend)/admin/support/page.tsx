'use client'

import React, { useState, useEffect } from 'react'
import { ConversationList } from '@/components/SupportDashboard/ConversationList'
import { ChatPane } from '@/components/SupportDashboard/ChatPane'

export default function SupportChatPage() {
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const fetchConversations = () => {
      fetch('/api/chat/support-dashboard', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data.docs) {
            setConversations(data.docs)
          }
        })
    }

    fetchConversations()

    // Socket connection for real-time updates
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:38120'
    const { io } = require('socket.io-client')
    const Cookies = require('js-cookie')
    const token = Cookies.get('payload-token')

    const socket = io(socketUrl, {
      transports: ['websocket'],
      auth: { token },
    })

    socket.on('connect', () => {
      socket.emit('joinSupport')
    })

    socket.on('conversationUpdated', () => {
      // Refresh list on update
      fetchConversations()
    })

    return () => socket.disconnect()
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Support Dashboard
        </h1>
        {activeId && (
          <button
            className="md:hidden text-sm text-blue-600 font-medium"
            onClick={() => setActiveId(null)}
          >
            Back to List
          </button>
        )}
      </header>
      <div className="flex-1 flex overflow-hidden relative">
        <div className={`w-full md:w-80 border-r border-gray-200 h-full bg-white flex-col ${activeId ? 'hidden md:flex' : 'flex'}`}>
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            onSelect={setActiveId}
          />
        </div>
        <div className={`flex-1 flex flex-col h-full bg-gray-100 ${!activeId ? 'hidden md:flex' : 'flex'}`}>
          {activeId ? (
            <ChatPane conversationId={activeId} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg font-medium">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
