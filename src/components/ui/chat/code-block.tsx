'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string
  language: string
  showLineNumbers?: boolean
}

const CodeBlockContext = React.createContext<{ code: string } | null>(null)

export function CodeBlock({
  code,
  language,
  showLineNumbers = false,
  className,
  children,
  ...props
}: CodeBlockProps) {
  // Use system preference for dark mode
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <CodeBlockContext.Provider value={{ code }}>
      <div
        className={cn('relative rounded-lg overflow-hidden border bg-muted', className)}
        {...props}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
          <span className="text-xs text-muted-foreground font-mono">{language}</span>
          {children}
        </div>
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={isDark ? oneDark : oneLight}
            showLineNumbers={showLineNumbers}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              fontSize: '0.875rem',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </CodeBlockContext.Provider>
  )
}

export interface CodeBlockCopyButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'onError'> {
  onCopy?: () => void
  onCopyError?: (error: Error) => void
  timeout?: number
}

export function CodeBlockCopyButton({
  onCopy,
  onCopyError,
  timeout = 2000,
  className,
  ...props
}: CodeBlockCopyButtonProps) {
  const context = React.useContext(CodeBlockContext)
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    if (!context?.code) return

    try {
      await navigator.clipboard.writeText(context.code)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), timeout)
    } catch (err) {
      onCopyError?.(err as Error)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-6 w-6', className)}
      onClick={handleCopy}
      {...props}
    >
      {copied ? <CheckIcon className="h-3 w-3 text-green-500" /> : <CopyIcon className="h-3 w-3" />}
    </Button>
  )
}
