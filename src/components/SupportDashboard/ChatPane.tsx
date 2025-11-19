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
      fetch(`/api/chat_messages?where[conversation][equals]=${conversationId}&sort=createdAt`, {
        cache: 'no-store',
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/jpg'
      ]
      if (validTypes.includes(file.type)) {
        setSelectedFile(file)
      } else {
        alert('Invalid file type. Please select a PDF, DOCX, or Image.')
      }
    }
  }

  const handleSendReply = async () => {
    if (!socket || (!inputValue.trim() && !selectedFile)) return

    let attachments: string[] = []

    if (selectedFile) {
      const formData = new FormData()
      formData.append('alt', selectedFile.name) // Append text fields first
      formData.append('file', selectedFile)

      try {
        const res = await fetch('/api/media', {
          method: 'POST',
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
      attachments,
    })
    setInputValue('')
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
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
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mb-2 flex flex-col gap-2">
                  {msg.attachments.map((att: any, i: number) => {
                    const file = att.file || att
                    if (!file) return null
                    const isImage = file.mimeType?.startsWith('image/')
                    
                    if (isImage) {
                      return (
                        <img 
                          key={i} 
                          src={file.url} 
                          alt={file.alt} 
                          className="rounded-lg max-h-48 object-cover w-full bg-black/10" 
                        />
                      )
                    }
                    
                    return (
                      <a 
                        key={i} 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 p-2 rounded-lg ${
                          msg.role === 'support' ? 'bg-blue-700/50 hover:bg-blue-700' : 'bg-gray-100 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate underline decoration-dotted underline-offset-2">{file.filename}</span>
                      </a>
                    )
                  })}
                </div>
              )}
              <p className="whitespace-pre-wrap">{msg.text}</p>
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

      {selectedFile && (
        <div className="px-6 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
              {selectedFile.type.startsWith('image/') ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-xs text-gray-600 truncate">{selectedFile.name}</span>
          </div>
          <button 
            onClick={() => {
              setSelectedFile(null)
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div className="p-4 bg-white border-t border-gray-200 flex gap-3 items-end">
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.docx,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors mb-3"
          title="Attach file"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
          </svg>
        </button>
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
          disabled={!inputValue.trim() && !selectedFile}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors h-14 flex items-center"
        >
          Send
        </button>
      </div>
    </div>
  )
}
