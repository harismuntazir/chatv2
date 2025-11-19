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
  const [searchTerm, setSearchTerm] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<any[]>([])
  const [isSearching, setIsSearching] = React.useState(false)

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // Search users collection for candidates
      const res = await fetch(`/api/users?where[email][contains]=${term}&where[roles.slug][equals]=candidate`)
      const data = await res.json()
      setSearchResults(data.docs || [])
    } catch (err) {
      console.error('Search failed', err)
    } finally {
      setIsSearching(false)
    }
  }

  const startChat = async (candidateId: string) => {
    try {
      const res = await fetch('/api/chat/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId }),
      })
      const conversation = await res.json()
      if (conversation.id) {
        onSelect(conversation.id)
        setSearchTerm('')
        setSearchResults([])
        // Refresh list would be ideal here, but for now we rely on the parent to refresh or socket update
        window.location.reload() // Simple way to refresh list for MVP
      }
    } catch (err) {
      console.error('Failed to start chat', err)
    }
  }

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Conversations
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-[calc(100%-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => startChat(candidate.id)}
                className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0"
              >
                <div className="font-medium text-sm text-gray-900">{candidate.email || 'Unknown'}</div>
                <div className="text-xs text-gray-500">{candidate.email}</div>
              </div>
            ))}
          </div>
        )}
      </div>

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
              <span className="font-medium text-gray-900 truncate max-w-[70%] flex flex-col">
                <span>{typeof conv.candidate === 'object' ? (conv.candidate as any).name || 'Unknown Candidate' : 'Candidate'}</span>
                <span className="text-xs text-gray-500 font-normal">{typeof conv.candidate === 'object' ? conv.candidate.email : ''}</span>
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
