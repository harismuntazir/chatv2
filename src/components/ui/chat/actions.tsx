'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export interface ActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Actions({ className, ...props }: ActionsProps) {
  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-1', className)} {...props} />
    </TooltipProvider>
  )
}

export interface ActionProps extends React.ComponentProps<typeof Button> {
  label: string
  tooltip?: string
}

export function Action({
  label,
  tooltip,
  className,
  children,
  variant = 'ghost',
  size = 'sm',
  ...props
}: ActionProps) {
  const button = (
    <Button
      variant={variant}
      size={size}
      className={cn('h-8 w-8 p-0', className)}
      aria-label={label}
      {...props}
    >
      {children}
    </Button>
  )

  if (tooltip || label) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip || label}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return button
}
