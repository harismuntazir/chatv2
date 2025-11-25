import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Message components to render */
  children: React.ReactNode
  /** Auto-scroll to bottom when new messages arrive (default: true) */
  autoScroll?: boolean
}

/**
 * Scrollable container for chat messages.
 * Automatically scrolls to bottom when new messages are added.
 *
 * @example
 * ```tsx
 * <ChatMessageList>
 *   {messages.map(msg => (
 *     <ChatBubble key={msg.id} {...msg} />
 *   ))}
 * </ChatMessageList>
 * ```
 */
export function ChatMessageList({
  children,
  className,
  autoScroll = true,
  ...props
}: ChatMessageListProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [children, autoScroll])

  return (
    <div className={cn('flex-1 overflow-y-auto p-4 flex flex-col', className)} {...props}>
      {children}
      <div ref={bottomRef} />
    </div>
  )
}
