'use client'

import * as React from 'react'
import { Paperclip, Send, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Mention, MentionContent, MentionInput, MentionItem } from './mention'

// ============================================================================
// Types
// ============================================================================

export interface MentionSuggestion {
  id: string
  label: string
  value: string
  subLabel?: string
}

export interface ChatInputProps {
  /** Current input value */
  value: string
  /** Callback when input value changes */
  onChange: (value: string) => void
  /** Callback when message is submitted */
  onSubmit: () => void
  /** Callback when file is selected */
  onFileSelect?: (file: File) => void
  /** Callback when file is removed */
  onFileRemove?: () => void
  /** Currently selected file */
  selectedFile?: File | null
  /** Input placeholder text */
  placeholder?: string
  /** Disable input */
  disabled?: boolean
  /** Character that triggers mention suggestions (default: "@") */
  mentionTrigger?: string
  /** List of mention suggestions */
  mentionSuggestions?: MentionSuggestion[]
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Component
// ============================================================================

/**
 * Chat input with file upload and @mention support.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSubmit={handleSend}
 * />
 *
 * // With file upload
 * <ChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSubmit={handleSend}
 *   onFileSelect={handleFileSelect}
 *   onFileRemove={handleFileRemove}
 *   selectedFile={file}
 * />
 *
 * // With @mentions
 * <ChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSubmit={handleSend}
 *   mentionSuggestions={[
 *     { id: '1', label: 'John Doe', value: 'john', subLabel: '@john' }
 *   ]}
 * />
 * ```
 */
export function ChatInput({
  value,
  onChange,
  onSubmit,
  onFileSelect,
  onFileRemove,
  selectedFile,
  placeholder = 'Type a message...',
  disabled = false,
  mentionTrigger = '@',
  mentionSuggestions = [],
  className,
}: ChatInputProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onFileSelect) {
      onFileSelect(file)
    }
  }

  return (
    <div className={cn('p-4 bg-white border-t border-gray-200', className)}>
      {/* Selected File Preview */}
      {selectedFile && (
        <div className="mb-2 flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Paperclip className="h-4 w-4" />
            </div>
            <span className="text-xs text-gray-600 truncate max-w-[200px]">
              {selectedFile.name}
            </span>
          </div>
          {onFileRemove && (
            <button
              onClick={onFileRemove}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <div className="flex gap-2 items-end">
        {/* File Upload Button */}
        {onFileSelect && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors mb-1"
              title="Attach file"
              disabled={disabled}
            >
              <Paperclip className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Input Area with Mentions */}
        <div className="flex-1 relative">
          <Mention trigger={mentionTrigger} className="w-full">
            <MentionInput
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="min-h-[44px] max-h-32 py-3 resize-none"
              asChild
            >
              <textarea rows={1} />
            </MentionInput>

            {mentionSuggestions.length > 0 && (
              <MentionContent>
                {mentionSuggestions.map((item) => (
                  <MentionItem
                    key={item.id}
                    value={item.value}
                    className="flex-col items-start gap-0.5"
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.subLabel && (
                      <span className="text-xs text-muted-foreground">{item.subLabel}</span>
                    )}
                  </MentionItem>
                ))}
              </MentionContent>
            )}
          </Mention>
        </div>

        {/* Send Button */}
        <button
          onClick={onSubmit}
          disabled={disabled || (!value.trim() && !selectedFile)}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10 mb-1 shadow-md"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
