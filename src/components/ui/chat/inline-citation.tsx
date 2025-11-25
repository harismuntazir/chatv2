'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export function InlineCitation({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('inline', className)} {...props} />
}

export function InlineCitationText({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('underline decoration-dotted underline-offset-2 cursor-help', className)}
      {...props}
    />
  )
}

export function InlineCitationCard({ ...props }: React.ComponentProps<typeof HoverCard>) {
  return <HoverCard openDelay={200} closeDelay={100} {...props} />
}

export type InlineCitationCardTriggerProps = React.ComponentProps<typeof HoverCardTrigger> & {
  sources: string[]
}

export function InlineCitationCardTrigger({
  sources,
  className,
  ...props
}: InlineCitationCardTriggerProps) {
  const hostname = sources[0] ? new URL(sources[0]).hostname.replace('www.', '') : 'unknown'
  const extraCount = sources.length - 1

  return (
    <HoverCardTrigger asChild {...props}>
      <Badge
        variant="secondary"
        className={cn('cursor-pointer ml-0.5 text-xs py-0 px-1.5', className)}
      >
        {hostname}
        {extraCount > 0 && ` +${extraCount}`}
      </Badge>
    </HoverCardTrigger>
  )
}

export function InlineCitationCardBody({
  className,
  ...props
}: React.ComponentProps<typeof HoverCardContent>) {
  return <HoverCardContent className={cn('w-80 p-0', className)} {...props} />
}

export function InlineCitationCarousel({
  className,
  ...props
}: React.ComponentProps<typeof Carousel>) {
  return <Carousel className={cn('w-full', className)} {...props} />
}

export function InlineCitationCarouselContent({
  className,
  ...props
}: React.ComponentProps<typeof CarouselContent>) {
  return <CarouselContent className={cn(className)} {...props} />
}

export function InlineCitationCarouselItem({
  className,
  ...props
}: React.ComponentProps<typeof CarouselItem>) {
  return <CarouselItem className={cn('p-4', className)} {...props} />
}

export function InlineCitationCarouselHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between p-2 border-b', className)} {...props} />
  )
}

export function InlineCitationCarouselIndex({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('text-xs text-muted-foreground', className)} {...props} />
}

export interface InlineCitationSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  url?: string
  description?: string
}

export function InlineCitationSource({
  title,
  url,
  description,
  className,
  ...props
}: InlineCitationSourceProps) {
  return (
    <div className={cn('space-y-1', className)} {...props}>
      {title && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-sm hover:underline"
        >
          {title}
        </a>
      )}
      {description && <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>}
    </div>
  )
}

export function InlineCitationQuote({
  className,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn('mt-2 border-l-2 pl-2 text-xs text-muted-foreground italic', className)}
      {...props}
    />
  )
}
