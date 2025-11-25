'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronRightIcon, FileIcon } from 'lucide-react'

export type TaskProps = React.ComponentProps<typeof Collapsible>

export function Task({ className, ...props }: TaskProps) {
  return <Collapsible className={cn('w-full', className)} {...props} />
}

export type TaskTriggerProps = React.ComponentProps<typeof CollapsibleTrigger> & {
  title: string
}

export function TaskTrigger({ title, className, ...props }: TaskTriggerProps) {
  return (
    <CollapsibleTrigger
      className={cn(
        'flex items-center gap-2 text-sm font-medium hover:text-foreground transition-colors group w-full',
        className,
      )}
      {...props}
    >
      <ChevronRightIcon className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
      <span>{title}</span>
    </CollapsibleTrigger>
  )
}

export type TaskContentProps = React.ComponentProps<typeof CollapsibleContent>

export function TaskContent({ className, ...props }: TaskContentProps) {
  return (
    <CollapsibleContent
      className={cn(
        'ml-6 mt-2 space-y-1 border-l-2 border-muted pl-4 animate-in slide-in-from-top-2',
        className,
      )}
      {...props}
    />
  )
}

export interface TaskItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TaskItem({ className, ...props }: TaskItemProps) {
  return (
    <div
      className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export interface TaskItemFileProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function TaskItemFile({ className, children, ...props }: TaskItemFileProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-xs font-mono',
        className,
      )}
      {...props}
    >
      <FileIcon className="h-3 w-3" />
      {children}
    </span>
  )
}
