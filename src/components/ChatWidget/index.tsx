'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useChatSocket } from './useChatSocket'
import './styles.css' // We'll create this or use inline styles

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { isConnected, sendMessage, conversationId } = useChatSocket({
    onMessage: (msg) => {
      setMessages((prev) => [...prev, msg])
    },
  })

  useEffect(() => {
    if (conversationId) {
      // Fetch history
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
  }, [messages, isOpen])

  const handleSend = () => {
    if (!inputValue.trim()) return
    sendMessage(inputValue)
    setInputValue('')
  }

  return (
    <div className="chat-widget-container">
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          Chat
        </button>
      )}
      
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Support Chat</h3>
            <button onClick={() => setIsOpen(false)}>X</button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.role === 'candidate' ? 'mine' : 'theirs'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              disabled={!isConnected}
            />
            <button onClick={handleSend} disabled={!isConnected}>Send</button>
          </div>
        </div>
      )}
    </div>
  )
}
