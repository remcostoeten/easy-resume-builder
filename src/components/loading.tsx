import { Loader2, FileText, Upload, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  message?: string
  icon?: React.ReactNode
  className?: string
}

export function Loading({
  size = 'md',
  variant = 'spinner',
  message,
  icon,
  className
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const renderSpinner = () => (
    <Loader2 className={cn(sizeClasses[size], 'animate-spin', className)} />
  )

  const renderDots = () => (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'w-2 h-2 bg-current rounded-full animate-bounce',
            size === 'sm' && 'w-1 h-1',
            size === 'lg' && 'w-3 h-3'
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )

  const renderPulse = () => (
    <div className={cn(
      'animate-pulse rounded bg-muted',
      size === 'sm' && 'w-16 h-4',
      size === 'md' && 'w-24 h-6',
      size === 'lg' && 'w-32 h-8',
      className
    )} />
  )

  const renderSkeleton = () => (
    <div className={cn('animate-pulse space-y-2', className)}>
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="h-4 bg-muted rounded w-5/6" />
    </div>
  )

  const renderContent = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner()
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      case 'skeleton':
        return renderSkeleton()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      {icon || renderContent()}
      {message && (
        <p className="text-sm text-muted-foreground text-center">
          {message}
        </p>
      )}
    </div>
  )
}

// Specific loading components for common use cases
export function LoadingSpinner({ message, ...props }: Omit<LoadingProps, 'variant'>) {
  return <Loading {...props} variant="spinner" message={message} />
}

export function LoadingDots({ message, ...props }: Omit<LoadingProps, 'variant'>) {
  return <Loading {...props} variant="dots" message={message} />
}

export function LoadingSkeleton({ message, ...props }: Omit<LoadingProps, 'variant'>) {
  return <Loading {...props} variant="skeleton" message={message} />
}

export function LoadingWithIcon({
  icon: customIcon,
  message,
  ...props
}: Omit<LoadingProps, 'icon'> & { icon?: React.ReactNode }) {
  return (
    <Loading
      {...props}
      icon={customIcon}
      message={message}
    />
  )
}

// Full page loading
export function FullPageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" message={message} />
    </div>
  )
}

// Button loading state
export function LoadingButton({
  loading,
  children,
  loadingText,
  ...props
}: {
  loading?: boolean
  children: React.ReactNode
  loadingText?: string
} & React.ComponentProps<typeof Button>) {
  return (
    <Button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || "Loading..."}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
