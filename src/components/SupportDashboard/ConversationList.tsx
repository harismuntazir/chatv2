'use client'

import React from 'react'

interface Conversation {
  id: string
  candidate: { email: string } | string
  lastMessageAt: string
  unreadBySupport: number
  status: string
}

interface ConversationListProps {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeId,
  onSelect,
}) => {
  return (
    <div className="conversation-list">
      <h3>Conversations</h3>
      <ul>
        {conversations.map((conv) => (
          <li
            key={conv.id}
            className={`conversation-item ${conv.id === activeId ? 'active' : ''} ${
              conv.unreadBySupport > 0 ? 'unread' : ''
            }`}
            onClick={() => onSelect(conv.id)}
          >
            <div className="conv-header">
              <span className="candidate-name">
                {typeof conv.candidate === 'object' ? conv.candidate.email : 'Candidate'}
              </span>
              <span className="conv-time">
                {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="conv-status">
              <span className={`status-badge ${conv.status}`}>{conv.status}</span>
              {conv.unreadBySupport > 0 && (
                <span className="unread-badge">{conv.unreadBySupport}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .conversation-list {
          width: 300px;
          border-right: 1px solid #eee;
          height: 100%;
          overflow-y: auto;
          background: #fff;
        }
        h3 {
          padding: 15px;
          margin: 0;
          border-bottom: 1px solid #eee;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .conversation-item {
          padding: 15px;
          border-bottom: 1px solid #f5f5f5;
          cursor: pointer;
          transition: background 0.2s;
        }
        .conversation-item:hover {
          background: #f9f9f9;
        }
        .conversation-item.active {
          background: #e6f7ff;
          border-right: 3px solid #1890ff;
        }
        .conv-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .candidate-name {
          font-weight: 500;
        }
        .conv-time {
          font-size: 12px;
          color: #999;
        }
        .conv-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .status-badge {
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .status-badge.open {
          background: #e6f7ff;
          color: #1890ff;
        }
        .status-badge.resolved {
          background: #f6ffed;
          color: #52c41a;
        }
        .unread-badge {
          background: #ff4d4f;
          color: white;
          border-radius: 10px;
          padding: 2px 8px;
          font-size: 11px;
        }
      `}</style>
    </div>
  )
}
