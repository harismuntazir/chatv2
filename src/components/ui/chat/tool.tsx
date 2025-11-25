'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { ChevronRightIcon } from 'lucide-react'

export type ToolState = 'input-streaming' | 'input-available' | 'output-available' | 'output-error'

export type ToolProps = React.ComponentProps<typeof Collapsible>

export function Tool({ className, ...props }: ToolProps) {
  return <Collapsible className={cn('w-full rounded-lg border', className)} {...props} />
}

export type ToolHeaderProps = React.ComponentProps<typeof CollapsibleTrigger> & {
  type: string
  state: ToolState
}

export function ToolHeader({ type, state, className, ...props }: ToolHeaderProps) {
  const stateLabels: Record<ToolState, string> = {
    'input-streaming': 'Running',
    'input-available': 'Pending',
    'output-available': 'Completed',
    'output-error': 'Error',
  }

  const stateVariants: Record<ToolState, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'input-streaming': 'default',
    'input-available': 'secondary',
    'output-available': 'outline',
    'output-error': 'destructive',
  }

  return (
    <CollapsibleTrigger
      className={cn(
        'flex items-center justify-between w-full p-3 hover:bg-muted/50 transition-colors group',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <ChevronRightIcon className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
        <span className="font-mono text-sm">{type}</span>
      </div>
      <Badge variant={stateVariants[state]}>{stateLabels[state]}</Badge>
    </CollapsibleTrigger>
  )
}

export type ToolContentProps = React.ComponentProps<typeof CollapsibleContent>

export function ToolContent({ className, ...props }: ToolContentProps) {
  return <CollapsibleContent className={cn('border-t p-3 space-y-3', className)} {...props} />
}

export interface ToolInputProps extends React.HTMLAttributes<HTMLDivElement> {
  input: any
}

export function ToolInput({ input, className, ...props }: ToolInputProps) {
  return (
    <div className={cn('space-y-1', className)} {...props}>
      <span className="text-xs font-medium text-muted-foreground">Input</span>
      <pre className="p-2 rounded bg-muted text-xs overflow-auto max-h-48">
        {JSON.stringify(input, null, 2)}
      </pre>
    </div>
  )
}

export interface ToolOutputProps extends React.HTMLAttributes<HTMLDivElement> {
  output?: React.ReactNode
  errorText?: string
}

export function ToolOutput({ output, errorText, className, ...props }: ToolOutputProps) {
  return (
    <div className={cn('space-y-1', className)} {...props}>
      <span className="text-xs font-medium text-muted-foreground">
        {errorText ? 'Error' : 'Output'}
      </span>
      {errorText ? (
        <p className="text-sm text-destructive">{errorText}</p>
      ) : (
        <div className="text-sm">{output}</div>
      )}
    </div>
  )
}
