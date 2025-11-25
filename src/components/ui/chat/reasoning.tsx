'use client'

import * as React from 'react'
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// Context
// ============================================================================

interface ReasoningContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  isLoading: boolean
  elapsed: number
}

const ReasoningContext = React.createContext<ReasoningContextValue | undefined>(undefined)

/**
 * Hook to access reasoning state from child components.
 * Must be used within a Reasoning provider.
 */
export function useReasoning() {
  const context = React.useContext(ReasoningContext)
  if (!context) {
    throw new Error('useReasoning must be used within a Reasoning provider')
  }
  return context
}

// ============================================================================
// Types
// ============================================================================

export interface ReasoningProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether reasoning is currently streaming/loading */
  isLoading?: boolean
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Pre-computed duration in seconds (for completed reasoning) */
  duration?: number
}

export interface ReasoningTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Custom title for the trigger */
  title?: string
}

export interface ReasoningContentProps extends React.HTMLAttributes<HTMLDivElement> {}

// ============================================================================
// Constants
// ============================================================================

const AUTO_CLOSE_DELAY = 1000 // ms after streaming ends

// ============================================================================
// Components
// ============================================================================

/**
 * Container for AI reasoning/thinking display.
 * Auto-opens when loading starts, auto-closes when complete.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Reasoning isLoading={isThinking}>
 *   <ReasoningTrigger title="Thinking" />
 *   <ReasoningContent>Let me think about this...</ReasoningContent>
 * </Reasoning>
 *
 * // With pre-computed duration (completed reasoning)
 * <Reasoning duration={8}>
 *   <ReasoningTrigger />
 *   <ReasoningContent>{reasoning}</ReasoningContent>
 * </Reasoning>
 * ```
 */
export function Reasoning({
  children,
  isLoading = false,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  duration: durationProp,
  className,
  ...props
}: ReasoningProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const [elapsed, setElapsed] = React.useState(0)
  const startTimeRef = React.useRef<number | null>(null)

  const open = openProp ?? internalOpen
  const setOpen = React.useCallback(
    (value: boolean) => {
      if (onOpenChange) {
        onOpenChange(value)
      } else {
        setInternalOpen(value)
      }
    },
    [onOpenChange],
  )

  // Auto-open when loading starts
  React.useEffect(() => {
    if (isLoading) {
      setOpen(true)
      startTimeRef.current = Date.now()
    }
  }, [isLoading, setOpen])

  // Auto-close after streaming ends
  React.useEffect(() => {
    if (!isLoading && startTimeRef.current) {
      const timer = setTimeout(() => {
        // Don't auto-close, let user decide
        // setOpen(false)
      }, AUTO_CLOSE_DELAY)
      return () => clearTimeout(timer)
    }
  }, [isLoading, setOpen])

  // Timer for loading state
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLoading) {
      interval = setInterval(() => {
        if (startTimeRef.current) {
          setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  // Use provided duration or calculated elapsed time
  const displayElapsed = durationProp ?? elapsed

  return (
    <ReasoningContext.Provider value={{ open, setOpen, isLoading, elapsed: displayElapsed }}>
      <div
        data-slot="reasoning"
        data-state={open ? 'open' : 'closed'}
        data-loading={isLoading || undefined}
        className={cn('flex flex-col', className)}
        {...props}
      >
        {children}
      </div>
    </ReasoningContext.Provider>
  )
}

/**
 * Clickable trigger that shows reasoning status and duration.
 *
 * @example
 * ```tsx
 * <ReasoningTrigger title="Thinking" />
 * <ReasoningTrigger>Custom content</ReasoningTrigger>
 * ```
 */
export function ReasoningTrigger({
  className,
  children,
  title = 'Reasoning',
  ...props
}: ReasoningTriggerProps) {
  const { open, setOpen, isLoading, elapsed } = useReasoning()

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      data-slot="reasoning-trigger"
      data-state={open ? 'open' : 'closed'}
      data-loading={isLoading || undefined}
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left py-1',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin shrink-0" />
      ) : open ? (
        <ChevronDown className="h-3 w-3 shrink-0 transition-transform" />
      ) : (
        <ChevronRight className="h-3 w-3 shrink-0 transition-transform" />
      )}
      <span className="font-medium truncate">
        {children || (isLoading ? 'Thinking...' : title)}
      </span>
      {elapsed > 0 && <span className="text-xs opacity-70 ml-auto tabular-nums">{elapsed}s</span>}
    </button>
  )
}

/**
 * Content container for reasoning text with animations.
 * Only renders when reasoning is open.
 *
 * @example
 * ```tsx
 * <ReasoningContent>
 *   Let me think about this step by step...
 * </ReasoningContent>
 * ```
 */
export function ReasoningContent({ className, children, ...props }: ReasoningContentProps) {
  const { open, isLoading } = useReasoning()

  if (!open) return null

  return (
    <div
      data-slot="reasoning-content"
      data-state="open"
      data-loading={isLoading || undefined}
      className={cn(
        'mt-2 text-sm text-muted-foreground whitespace-pre-wrap overflow-auto max-h-64',
        'animate-in fade-in slide-in-from-top-1 duration-200',
        'border-l-2 border-muted pl-3 py-1',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
