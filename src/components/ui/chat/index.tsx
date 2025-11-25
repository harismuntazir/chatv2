/**
 * @module @/components/ui/chat
 *
 * A modular, plug-and-play chat UI library combining:
 * - Custom responsive chat components
 * - Dice UI mentions (@mentions)
 * - shadcn.io AI Elements
 *
 * @example
 * ```tsx
 * import {
 *   // Core Chat Components
 *   Chat,
 *   ChatMessageList,
 *   ChatBubble,
 *   ChatInput,
 *
 *   // AI Reasoning
 *   Reasoning,
 *   ReasoningTrigger,
 *   ReasoningContent,
 *
 *   // Mentions (Dice UI)
 *   Mention,
 *   MentionInput,
 *   MentionContent,
 *   MentionItem,
 *
 *   // shadcn.io AI Elements
 *   Conversation,
 *   Message,
 *   MessageContent,
 *   PromptInput,
 *   Response,
 *   CodeBlock,
 *   Loader,
 *   Actions,
 *   Sources,
 *   Suggestions,
 *   Task,
 *   Tool,
 *   Branch,
 *   InlineCitation,
 *   AIImage,
 * } from '@/components/ui/chat'
 * ```
 */

// ====================
// Core Chat Components
// ====================
export { Chat, type ChatProps } from './chat'
export { ChatMessageList, type ChatMessageListProps } from './chat-message-list'
export { ChatBubble, type ChatBubbleProps, type Attachment } from './chat-bubble'
export { ChatInput, type ChatInputProps, type MentionSuggestion } from './chat-input'

// ====================
// Reasoning Components (for AI thinking display)
// ====================
export {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
  useReasoning,
  type ReasoningProps,
  type ReasoningTriggerProps,
  type ReasoningContentProps,
} from './reasoning'

// ====================
// Mention Components (Dice UI - for @mentions)
// ====================
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

// ====================
// Conversation (shadcn.io AI)
// ====================
export {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  type ConversationProps,
  type ConversationContentProps,
  type ConversationScrollButtonProps,
} from './conversation'

// ====================
// Message (shadcn.io AI)
// ====================
export {
  Message,
  MessageContent,
  MessageAvatar,
  type MessageProps,
  type MessageContentProps,
  type MessageAvatarProps,
} from './message'

// ====================
// Prompt Input (shadcn.io AI)
// ====================
export {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectValue,
  type ChatStatus,
  type PromptInputProps,
  type PromptInputTextareaProps,
  type PromptInputToolbarProps,
  type PromptInputToolsProps,
  type PromptInputButtonProps,
  type PromptInputSubmitProps,
  type PromptInputModelSelectProps,
  type PromptInputModelSelectTriggerProps,
  type PromptInputModelSelectContentProps,
  type PromptInputModelSelectItemProps,
  type PromptInputModelSelectValueProps,
} from './prompt-input'

// ====================
// Response (shadcn.io AI - Markdown rendering)
// ====================
export { Response, type ResponseProps } from './response'

// ====================
// Code Block (shadcn.io AI)
// ====================
export {
  CodeBlock,
  CodeBlockCopyButton,
  type CodeBlockProps,
  type CodeBlockCopyButtonProps,
} from './code-block'

// ====================
// Loader (shadcn.io AI)
// ====================
export { Loader, type LoaderProps } from './loader'

// ====================
// Actions (shadcn.io AI - Copy, Regenerate, etc.)
// ====================
export { Actions, Action, type ActionsProps, type ActionProps } from './actions'

// ====================
// Sources (shadcn.io AI)
// ====================
export {
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
  type SourcesProps,
  type SourcesTriggerProps,
  type SourcesContentProps,
  type SourceProps,
} from './sources'

// ====================
// Suggestions (shadcn.io AI)
// ====================
export { Suggestions, Suggestion, type SuggestionsProps, type SuggestionProps } from './suggestion'

// ====================
// Task (shadcn.io AI)
// ====================
export {
  Task,
  TaskTrigger,
  TaskContent,
  TaskItem,
  TaskItemFile,
  type TaskProps,
  type TaskTriggerProps,
  type TaskContentProps,
  type TaskItemProps,
  type TaskItemFileProps,
} from './task'

// ====================
// Tool (shadcn.io AI)
// ====================
export {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
  type ToolState,
  type ToolProps,
  type ToolHeaderProps,
  type ToolContentProps,
  type ToolInputProps,
  type ToolOutputProps,
} from './tool'

// ====================
// Branch (shadcn.io AI - for response variations)
// ====================
export {
  Branch,
  BranchMessages,
  BranchSelector,
  BranchPrevious,
  BranchNext,
  BranchPage,
  type BranchProps,
  type BranchMessagesProps,
  type BranchSelectorProps,
  type BranchPreviousProps,
  type BranchNextProps,
  type BranchPageProps,
} from './branch'

// ====================
// Inline Citation (shadcn.io AI)
// ====================
export {
  InlineCitation,
  InlineCitationText,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselItem,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationSource,
  InlineCitationQuote,
  type InlineCitationCardTriggerProps,
  type InlineCitationSourceProps,
} from './inline-citation'

// ====================
// AI Image (shadcn.io AI)
// ====================
export { AIImage, type AIImageProps } from './image'
