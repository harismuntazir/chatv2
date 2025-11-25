import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * Root container for the chat UI.
 * Provides layout structure for ChatMessageList and ChatInput.
 *
 * @example
 * ```tsx
 * <Chat className="h-[600px]">
 *   <ChatMessageList>{messages}</ChatMessageList>
 *   <ChatInput />
 * </Chat>
 * ```
 */
export function Chat({ children, className, ...props }: ChatProps) {
  return (
    <div
      data-slot="chat"
      className={cn('flex flex-col h-full w-full overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  )
}
