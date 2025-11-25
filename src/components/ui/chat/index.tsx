/**
 * @module @/components/ui/chat
 *
 * A modular, plug-and-play chat UI library.
 *
 * @example
 * ```tsx
 * import {
 *   Chat,
 *   ChatMessageList,
 *   ChatBubble,
 *   ChatInput,
 *   Reasoning,
 *   ReasoningTrigger,
 *   ReasoningContent,
 *   Mention,
 *   MentionInput,
 *   MentionContent,
 *   MentionItem,
 * } from '@/components/ui/chat'
 *
 * <Chat>
 *   <ChatMessageList>
 *     <ChatBubble
 *       role="assistant"
 *       content="Here's my answer"
 *       reasoning="Let me think step by step..."
 *     />
 *   </ChatMessageList>
 *   <ChatInput
 *     value={input}
 *     onChange={setInput}
 *     onSubmit={handleSend}
 *     mentionSuggestions={users}
 *   />
 * </Chat>
 * ```
 */

// Core Chat Components
export { Chat, type ChatProps } from './chat'
export { ChatMessageList, type ChatMessageListProps } from './chat-message-list'
export { ChatBubble, type ChatBubbleProps, type Attachment } from './chat-bubble'
export { ChatInput, type ChatInputProps, type MentionSuggestion } from './chat-input'

// Reasoning Components (for AI thinking display)
export {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
  useReasoning,
  type ReasoningProps,
  type ReasoningTriggerProps,
  type ReasoningContentProps,
} from './reasoning'

// Mention Components (for @mentions)
export {
  Mention,
  MentionInput,
  MentionContent,
  MentionItem,
  MentionLabel,
  type MentionProps,
  type MentionInputProps,
  type MentionContentProps,
  type MentionItemProps,
  type MentionLabelProps,
} from './mention'
