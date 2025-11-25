import * as React from 'react'
import { cn } from '@/lib/utils'
import { FileIcon } from 'lucide-react'
import { Reasoning, ReasoningTrigger, ReasoningContent } from './reasoning'

// ============================================================================
// Types
// ============================================================================

export interface Attachment {
  id: string
  url: string
  filename: string
  mimeType: string
  alt?: string
}

export interface ChatBubbleProps {
  /** Message sender role */
  role: 'user' | 'assistant' | 'system' | 'support' | 'candidate'
  /** Message text content */
  content: string
  /** File/image attachments */
  attachments?: Attachment[]
  /** AI reasoning/thinking content (only shown for non-user roles) */
  reasoning?: string
  /** Duration of reasoning in seconds */
  reasoningDuration?: number
  /** Message timestamp */
  createdAt?: string | Date
  /** Additional CSS classes */
  className?: string
  /** Custom avatar element */
  avatar?: React.ReactNode
}

// ============================================================================
// Component
// ============================================================================

/**
 * Individual chat message bubble.
 * Supports text, attachments, and AI reasoning display.
 *
 * @example
 * ```tsx
 * // User message
 * <ChatBubble role="user" content="Hello!" />
 *
 * // AI message with reasoning
 * <ChatBubble
 *   role="assistant"
 *   content="Here's my answer"
 *   reasoning="Let me think step by step..."
 *   reasoningDuration={5}
 * />
 *
 * // With attachments
 * <ChatBubble
 *   role="user"
 *   content="Check this file"
 *   attachments={[{ id: '1', url: '/file.pdf', filename: 'doc.pdf', mimeType: 'application/pdf' }]}
 * />
 * ```
 */
export function ChatBubble({
  role,
  content,
  attachments,
  reasoning,
  reasoningDuration,
  createdAt,
  className,
  avatar,
}: ChatBubbleProps) {
  const isUser = role === 'user' || role === 'candidate'

  return (
    <div
      className={cn('flex w-full gap-2 mb-4', isUser ? 'flex-row-reverse' : 'flex-row', className)}
    >
      {avatar && <div className="shrink-0">{avatar}</div>}

      <div className={cn('flex flex-col max-w-[80%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm shadow-sm',
            isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none',
          )}
        >
          {/* Reasoning Block (only for AI/Assistant) */}
          {!isUser && reasoning && (
            <Reasoning duration={reasoningDuration} className="mb-3">
              <ReasoningTrigger title="Reasoning" />
              <ReasoningContent>{reasoning}</ReasoningContent>
            </Reasoning>
          )}

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <div className="mb-2 flex flex-col gap-2">
              {attachments.map((att) => (
                <AttachmentItem key={att.id} attachment={att} isUser={isUser} />
              ))}
            </div>
          )}

          {/* Text Content */}
          <div className="whitespace-pre-wrap break-words">{content}</div>
        </div>

        {/* Timestamp */}
        {createdAt && (
          <span className="text-[10px] text-gray-400 mt-1 px-1">
            {new Date(createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  )
}

function AttachmentItem({ attachment, isUser }: { attachment: Attachment; isUser: boolean }) {
  const isImage = attachment.mimeType?.startsWith('image/')

  if (isImage) {
    return (
      <img
        src={attachment.url}
        alt={attachment.alt || attachment.filename}
        className="rounded-lg max-h-48 object-cover w-full bg-black/10"
      />
    )
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg transition-colors',
        isUser ? 'bg-blue-700/50 hover:bg-blue-700' : 'bg-gray-100 hover:bg-gray-200',
      )}
    >
      <FileIcon className="h-4 w-4 shrink-0" />
      <span className="truncate underline decoration-dotted underline-offset-2 text-xs">
        {attachment.filename}
      </span>
    </a>
  )
}
