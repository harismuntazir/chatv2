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
    <div className="h-full overflow-y-auto flex flex-col">
      <h3 className="p-4 text-lg font-semibold border-b border-gray-100 text-gray-800">
        Conversations
      </h3>
      <ul className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <li
            key={conv.id}
            className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${
              conv.id === activeId ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
            } ${conv.unreadBySupport > 0 ? 'bg-red-50/30' : ''}`}
            onClick={() => onSelect(conv.id)}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-900 truncate max-w-[70%]">
                {typeof conv.candidate === 'object' ? conv.candidate.email : 'Candidate'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide ${
                  conv.status === 'open'
                    ? 'bg-blue-100 text-blue-700'
                    : conv.status === 'resolved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {conv.status}
              </span>
              {conv.unreadBySupport > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {conv.unreadBySupport}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
