'use client'

import React, { useState, useEffect } from 'react'
import { ConversationList } from '@/components/SupportDashboard/ConversationList'
import { ChatPane } from '@/components/SupportDashboard/ChatPane'

export default function SupportChatPage() {
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/chat/support-dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.docs) {
          setConversations(data.docs)
        }
      })
  }, [])

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Support Dashboard</h1>
      </div>
      <div className="dashboard-content">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
        />
        {activeId ? (
          <ChatPane conversationId={activeId} />
        ) : (
          <div className="empty-state">Select a conversation to start chatting</div>
        )}
      </div>
      <style jsx>{`
        .dashboard-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .dashboard-header {
          padding: 15px 20px;
          background: #fff;
          border-bottom: 1px solid #eee;
        }
        .dashboard-header h1 {
          margin: 0;
          font-size: 20px;
        }
        .dashboard-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        .empty-state {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          background: #f0f2f5;
        }
      `}</style>
    </div>
  )
}
