'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface BranchContextValue {
  currentBranch: number
  totalBranches: number
  setCurrentBranch: (index: number) => void
}

const BranchContext = React.createContext<BranchContextValue | null>(null)

function useBranch() {
  const context = React.useContext(BranchContext)
  if (!context) {
    throw new Error('useBranch must be used within a Branch')
  }
  return context
}

export interface BranchProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultBranch?: number
  onBranchChange?: (index: number) => void
}

export function Branch({
  defaultBranch = 0,
  onBranchChange,
  className,
  children,
  ...props
}: BranchProps) {
  const [currentBranch, setCurrentBranchState] = React.useState(defaultBranch)
  const [totalBranches, setTotalBranches] = React.useState(0)

  const setCurrentBranch = React.useCallback(
    (index: number) => {
      setCurrentBranchState(index)
      onBranchChange?.(index)
    },
    [onBranchChange],
  )

  // Count children in BranchMessages
  React.useEffect(() => {
    const messagesChild = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === BranchMessages,
    )
    if (React.isValidElement(messagesChild) && messagesChild.props) {
      const props = messagesChild.props as { children?: React.ReactNode }
      setTotalBranches(React.Children.count(props.children))
    }
  }, [children])

  return (
    <BranchContext.Provider value={{ currentBranch, totalBranches, setCurrentBranch }}>
      <div className={cn('relative', className)} {...props}>
        {children}
      </div>
    </BranchContext.Provider>
  )
}

export interface BranchMessagesProps extends React.HTMLAttributes<HTMLDivElement> {}

export function BranchMessages({ children, className, ...props }: BranchMessagesProps) {
  const { currentBranch } = useBranch()
  const childArray = React.Children.toArray(children)
  const currentChild = childArray[currentBranch]

  return (
    <div className={cn(className)} {...props}>
      {currentChild}
    </div>
  )
}

export interface BranchSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  from?: 'user' | 'assistant' | 'system'
}

export function BranchSelector({ from, className, ...props }: BranchSelectorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1',
        from === 'user' ? 'justify-end' : 'justify-start',
        className,
      )}
      {...props}
    />
  )
}

export interface BranchPreviousProps extends React.ComponentProps<typeof Button> {}

export function BranchPrevious({ className, ...props }: BranchPreviousProps) {
  const { currentBranch, setCurrentBranch } = useBranch()
  const canGoPrevious = currentBranch > 0

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-6 w-6', className)}
      disabled={!canGoPrevious}
      onClick={() => setCurrentBranch(currentBranch - 1)}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
    </Button>
  )
}

export interface BranchNextProps extends React.ComponentProps<typeof Button> {}

export function BranchNext({ className, ...props }: BranchNextProps) {
  const { currentBranch, totalBranches, setCurrentBranch } = useBranch()
  const canGoNext = currentBranch < totalBranches - 1

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-6 w-6', className)}
      disabled={!canGoNext}
      onClick={() => setCurrentBranch(currentBranch + 1)}
      {...props}
    >
      <ChevronRightIcon className="h-4 w-4" />
    </Button>
  )
}

export interface BranchPageProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function BranchPage({ className, ...props }: BranchPageProps) {
  const { currentBranch, totalBranches } = useBranch()

  return (
    <span className={cn('text-xs text-muted-foreground tabular-nums', className)} {...props}>
      {currentBranch + 1} / {totalBranches}
    </span>
  )
}
