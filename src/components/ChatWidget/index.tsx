'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useChatSocket } from './useChatSocket'
import { Chat, ChatMessageList, ChatBubble, ChatInput } from '../ui/chat'
import { MessageCircle, X } from 'lucide-react'

export const ChatWidget: React.FC<{ user?: any }> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [inputValue, setInputValue] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hide widget for support and admin roles
  const shouldHide = user?.roles?.some(
    (r: any) =>
      (typeof r === 'string' ? r : r.slug) === 'admin' ||
      (typeof r === 'string' ? r : r.slug) === 'support',
  )

  const { isConnected, sendMessage, conversationId } = useChatSocket({
    onMessage: (msg) => {
      setMessages((prev) => [...prev, msg])
    },
  })

  useEffect(() => {
    if (conversationId) {
      fetch(`/api/chat_messages?where[conversation][equals]=${conversationId}&sort=createdAt`, {
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

  const handleSend = async () => {
    if (!inputValue.trim() && !selectedFile) return

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

    sendMessage(inputValue, { attachments })
    setInputValue('')
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (shouldHide) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {!isOpen && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center justify-center"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white md:absolute md:inset-auto md:bottom-20 md:right-0 md:w-96 md:h-[600px] md:rounded-xl md:shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg">Support Chat</h3>
              <span className="text-xs text-blue-100 flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
                ></span>
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <ChatMessageList className="bg-gray-50">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                role={msg.role === 'candidate' ? 'user' : 'support'}
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
            onSubmit={handleSend}
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
          />
        </div>
      )}
    </div>
  )
}
