'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { CodeBlock, CodeBlockCopyButton } from './code-block'

export interface ResponseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string | React.ReactNode
  parseIncompleteMarkdown?: boolean
}

function parseIncompleteMarkdownFn(text: string): string {
  // Auto-complete incomplete formatting tokens
  let result = text

  // Count opening/closing tokens
  const boldCount = (result.match(/\*\*/g) || []).length
  const italicCount = (result.match(/(?<!\*)\*(?!\*)/g) || []).length
  const strikeCount = (result.match(/~~/g) || []).length
  const codeCount = (result.match(/(?<!`)`(?!`)/g) || []).length

  // Close incomplete formatting
  if (boldCount % 2 !== 0) result += '**'
  if (italicCount % 2 !== 0) result += '*'
  if (strikeCount % 2 !== 0) result += '~~'
  if (codeCount % 2 !== 0) result += '`'

  // Hide incomplete links [text without ]
  result = result.replace(/\[([^\]]*?)$/g, '')

  // Hide incomplete images ![alt without ]
  result = result.replace(/!\[([^\]]*?)$/g, '')

  return result
}

export function Response({
  children,
  className,
  parseIncompleteMarkdown = true,
  ...props
}: ResponseProps) {
  const content =
    typeof children === 'string'
      ? parseIncompleteMarkdown
        ? parseIncompleteMarkdownFn(children)
        : children
      : children

  if (typeof content !== 'string') {
    return (
      <div className={cn('prose prose-sm dark:prose-invert max-w-none', className)} {...props}>
        {content}
      </div>
    )
  }

  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none', className)} {...props}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className: codeClassName, children, ...codeProps }) {
            const match = /language-(\w+)/.exec(codeClassName || '')
            const isInline = !match

            if (isInline) {
              return (
                <code
                  className={cn('bg-muted px-1.5 py-0.5 rounded text-sm', codeClassName)}
                  {...codeProps}
                >
                  {children}
                </code>
              )
            }

            return (
              <CodeBlock language={match[1]} code={String(children).replace(/\n$/, '')}>
                <CodeBlockCopyButton />
              </CodeBlock>
            )
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
