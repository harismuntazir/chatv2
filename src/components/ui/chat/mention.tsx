'use client'

import * as MentionPrimitive from '@diceui/mention'
import * as React from 'react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export type MentionProps = React.ComponentProps<typeof MentionPrimitive.Root>
export type MentionLabelProps = React.ComponentProps<typeof MentionPrimitive.Label>
export type MentionInputProps = React.ComponentProps<typeof MentionPrimitive.Input>
export type MentionContentProps = React.ComponentProps<typeof MentionPrimitive.Content>
export type MentionItemProps = React.ComponentProps<typeof MentionPrimitive.Item>

// ============================================================================
// Components
// ============================================================================

/**
 * Root container for mention functionality.
 * Handles @mention detection and popover state.
 *
 * @example
 * ```tsx
 * <Mention trigger="@">
 *   <MentionInput placeholder="Type @ to mention..." />
 *   <MentionContent>
 *     <MentionItem value="john">John Doe</MentionItem>
 *     <MentionItem value="jane">Jane Smith</MentionItem>
 *   </MentionContent>
 * </Mention>
 * ```
 */
function Mention({ className, ...props }: MentionProps) {
  return (
    <MentionPrimitive.Root
      data-slot="mention"
      className={cn(
        '**:data-tag:rounded **:data-tag:bg-blue-200 **:data-tag:py-px **:data-tag:text-blue-950 dark:**:data-tag:bg-blue-800 dark:**:data-tag:text-blue-50',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Accessible label for the mention input.
 */
function MentionLabel({ className, ...props }: MentionLabelProps) {
  return (
    <MentionPrimitive.Label
      data-slot="mention-label"
      className={cn('px-0.5 py-1.5 font-semibold text-sm', className)}
      {...props}
    />
  )
}

/**
 * Text input that triggers mention suggestions.
 * Supports asChild for custom input elements.
 *
 * @example
 * ```tsx
 * // Default input
 * <MentionInput placeholder="Type a message..." />
 *
 * // With custom textarea
 * <MentionInput asChild>
 *   <textarea rows={3} />
 * </MentionInput>
 * ```
 */
function MentionInput({ className, ...props }: MentionInputProps) {
  return (
    <MentionPrimitive.Input
      data-slot="mention-input"
      className={cn(
        'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Popover container for mention suggestions.
 * Automatically positions near the cursor.
 */
function MentionContent({ className, children, ...props }: MentionContentProps) {
  return (
    <MentionPrimitive.Portal>
      <MentionPrimitive.Content
        data-slot="mention-content"
        className={cn(
          'relative z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...props}
      >
        {children}
      </MentionPrimitive.Content>
    </MentionPrimitive.Portal>
  )
}

/**
 * Individual mention suggestion item.
 *
 * @example
 * ```tsx
 * <MentionItem value="john">
 *   <Avatar src="/john.jpg" />
 *   <div>
 *     <div>John Doe</div>
 *     <div className="text-xs text-muted-foreground">@john</div>
 *   </div>
 * </MentionItem>
 * ```
 */
function MentionItem({ className, children, ...props }: MentionItemProps) {
  return (
    <MentionPrimitive.Item
      data-slot="mention-item"
      className={cn(
        'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden',
        'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </MentionPrimitive.Item>
  )
}

export { Mention, MentionContent, MentionInput, MentionItem, MentionLabel }
