'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export interface SuggestionsProps extends React.ComponentProps<typeof ScrollArea> {}

export function Suggestions({ className, ...props }: SuggestionsProps) {
  return (
    <ScrollArea className={cn('w-full whitespace-nowrap', className)} {...props}>
      <div className="flex gap-2 pb-2">{props.children}</div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export interface SuggestionProps extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {
  suggestion: string
  onClick?: (suggestion: string) => void
}

export function Suggestion({
  suggestion,
  onClick,
  className,
  children,
  variant = 'outline',
  size = 'sm',
  ...props
}: SuggestionProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('rounded-full shrink-0', className)}
      onClick={() => onClick?.(suggestion)}
      {...props}
    >
      {children || suggestion}
    </Button>
  )
}
