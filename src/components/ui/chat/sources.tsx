'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDownIcon, BookOpenIcon } from 'lucide-react'

export type SourcesProps = React.ComponentProps<typeof Collapsible>

export function Sources({ className, ...props }: SourcesProps) {
  return <Collapsible className={cn('w-full', className)} {...props} />
}

export type SourcesTriggerProps = React.ComponentProps<typeof CollapsibleTrigger> & {
  count: number
}

export function SourcesTrigger({ count, className, children, ...props }: SourcesTriggerProps) {
  return (
    <CollapsibleTrigger
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group',
        className,
      )}
      {...props}
    >
      {children || (
        <>
          <BookOpenIcon className="h-4 w-4" />
          <span>Used {count} sources</span>
          <ChevronDownIcon className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
        </>
      )}
    </CollapsibleTrigger>
  )
}

export type SourcesContentProps = React.ComponentProps<typeof CollapsibleContent>

export function SourcesContent({ className, ...props }: SourcesContentProps) {
  return (
    <CollapsibleContent
      className={cn('mt-2 space-y-2 animate-in slide-in-from-top-2', className)}
      {...props}
    />
  )
}

export interface SourceProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title?: string
}

export function Source({ href, title, className, children, ...props }: SourceProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm',
        className,
      )}
      {...props}
    >
      <BookOpenIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="truncate">{children || title || href}</span>
    </a>
  )
}
