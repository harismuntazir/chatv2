import * as React from 'react'
import { cn } from '@/lib/utils'

export interface AIImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  base64: string
  mediaType: string
  uint8Array?: Uint8Array
}

export function AIImage({
  base64,
  mediaType,
  uint8Array,
  className,
  alt = 'AI generated image',
  ...props
}: AIImageProps) {
  const src = `data:${mediaType};base64,${base64}`

  return <img src={src} alt={alt} className={cn('rounded-lg', className)} {...props} />
}
