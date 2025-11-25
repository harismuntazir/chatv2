'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Chat, ChatMessageList, ChatBubble, ChatInput } from '../ui/chat'

interface ChatPaneProps {
  conversationId: string
}

export const ChatPane: React.FC<ChatPaneProps> = ({ conversationId }) => {
  const [messages, setMessages] = useState<any[]>([])
  const [inputValue, setInputValue] = useState('')
  const [socket, setSocket] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (conversationId) {
      fetch(`/api/chat_messages?where[conversation][equals]=${conversationId}&sort=createdAt`, {
        cache: 'no-store',
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.docs) {
            setMessages(data.docs)
          }
        })
    }
  }, [conversationId])

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:38120'
    const { io } = require('socket.io-client')
    const Cookies = require('js-cookie')
    const token = Cookies.get('payload-token')

    const newSocket = io(socketUrl, {
      transports: ['websocket'],
      auth: {
        token,
      },
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

  const handleSendReply = async () => {
    if (!socket || (!inputValue.trim() && !selectedFile)) return

    let attachments: string[] = []

    if (selectedFile) {
      const formData = new FormData()
      formData.append('alt', selectedFile.name)
      formData.append('file', selectedFile)

      try {
        const res = await fetch('/api/media', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          attachments.push(data.doc.id)
        } else {
          console.error('Failed to upload file')
          alert('Failed to upload file')
          return
        }
      } catch (err) {
        console.error('Error uploading file', err)
        alert('Error uploading file')
        return
      }
    }

    socket.emit('message', {
      conversationId,
      text: inputValue,
      meta: { attachments },
    })
    setInputValue('')
    setSelectedFile(null)
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100">
      <ChatMessageList className="flex-1 gap-4">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            // In Support Dashboard: Support is "user" (right), Candidate is "other" (left)
            role={msg.role === 'support' ? 'user' : 'candidate'}
            content={msg.text}
            attachments={msg.attachments?.map((att: any) => ({
              id: att.id || att,
              url: att.url || att.file?.url,
              filename: att.filename || att.file?.filename,
              mimeType: att.mimeType || att.file?.mimeType,
              alt: att.alt || att.file?.alt,
            }))}
            createdAt={msg.createdAt}
            reasoning={msg.reasoning}
            reasoningDuration={msg.reasoningDuration}
          />
        ))}
      </ChatMessageList>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSendReply}
        onFileSelect={(file) => {
          const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/jpg',
          ]
          if (validTypes.includes(file.type)) {
            setSelectedFile(file)
          } else {
            alert('Invalid file type. Please select a PDF, DOCX, or Image.')
          }
        }}
        onFileRemove={() => setSelectedFile(null)}
        selectedFile={selectedFile}
        placeholder="Type a reply..."
        className="border-t border-gray-200"
      />
    </div>
  )
}
