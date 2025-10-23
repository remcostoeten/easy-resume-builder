import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonLoaderProps {
  className?: string
  children?: React.ReactNode
  aspectRatio?: 'square' | 'video' | 'portrait' | string
  width?: string | number
  height?: string | number
}

export function SkeletonLoader({
  className,
  children,
  aspectRatio,
  width,
  height
}: SkeletonLoaderProps) {
  const style: React.CSSProperties = {}

  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height
  if (aspectRatio) {
    if (aspectRatio === 'square') style.aspectRatio = '1/1'
    else if (aspectRatio === 'video') style.aspectRatio = '16/9'
    else if (aspectRatio === 'portrait') style.aspectRatio = '3/4'
    else style.aspectRatio = aspectRatio
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={style}
    >
      <Skeleton className="absolute inset-0 h-full w-full" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// Text skeleton with consistent line heights
export function TextSkeleton({
  lines = 1,
  lineHeight = '1.5rem',
  lastLineWidth = '100%',
  className
}: {
  lines?: number
  lineHeight?: string
  lastLineWidth?: string
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)} style={{ lineHeight }}>
      {Array.from({ length: lines }, (_, i) => {
        const isLast = i === lines - 1
        const width = isLast ? lastLineWidth :
                     ['60%', '80%', '90%', '70%', '85%'][i % 5]

        return (
          <Skeleton
            key={i}
            className="block"
            style={{
              height: lineHeight,
              width,
            }}
          />
        )
      })}
    </div>
  )
}

// Card skeleton with consistent layout
export function CardSkeleton({
  className,
  header = true,
  content = true,
  footer = false,
  headerHeight = '3rem',
  contentHeight = '6rem',
  footerHeight = '2.5rem'
}: {
  className?: string
  header?: boolean
  content?: boolean
  footer?: boolean
  headerHeight?: string
  contentHeight?: string
  footerHeight?: string
}) {
  return (
    <div className={cn('rounded-lg border border-border bg-card overflow-hidden', className)}>
      {header && (
        <div style={{ height: headerHeight }}>
          <Skeleton className="h-full w-full rounded-b-none" />
        </div>
      )}
      {content && (
        <div style={{ height: contentHeight }} className="p-4">
          <TextSkeleton lines={2} />
        </div>
      )}
      {footer && (
        <div style={{ height: footerHeight }} className="border-t border-border">
          <Skeleton className="h-full w-full rounded-t-none" />
        </div>
      )}
    </div>
  )
}

// List item skeleton
export function ListItemSkeleton({
  className,
  showAvatar = true,
  avatarSize = '2.5rem',
  lines = 2,
  showActions = false,
  actionsWidth = '4rem'
}: {
  className?: string
  showAvatar?: boolean
  avatarSize?: string
  lines?: number
  showActions?: boolean
  actionsWidth?: string
}) {
  return (
    <div className={cn('flex items-center gap-3 p-3 border border-border rounded-lg bg-card', className)}>
      {showAvatar && (
        <Skeleton
          className="rounded-full flex-shrink-0"
          style={{
            width: avatarSize,
            height: avatarSize
          }}
        />
      )}
      <div className="flex-1 min-w-0">
        <TextSkeleton lines={lines} lastLineWidth="70%" />
      </div>
      {showActions && (
        <Skeleton
          className="flex-shrink-0"
          style={{ width: actionsWidth, height: '2rem' }}
        />
      )}
    </div>
  )
}

// Sidebar skeleton with fixed layout
export function SidebarSkeleton({
  className,
  header = true,
  items = 5,
  itemHeight = '4rem',
  footer = false,
  footerHeight = '3rem'
}: {
  className?: string
  header?: boolean
  items?: number
  itemHeight?: string
  footer?: boolean
  footerHeight?: string
}) {
  return (
    <div className={cn('flex flex-col h-full bg-card', className)}>
      {header && (
        <div className="border-b border-border bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div className="space-y-1.5 p-2">
          {Array.from({ length: items }, (_, i) => (
            <div key={i} style={{ height: itemHeight }}>
              <ListItemSkeleton
                className="h-full"
                showAvatar={true}
                avatarSize="1.75rem"
                lines={1}
                showActions={true}
                actionsWidth="5rem"
              />
            </div>
          ))}
        </div>
      </div>

      {footer && (
        <div style={{ height: footerHeight }} className="border-t border-border bg-muted/20 p-2">
          <TextSkeleton lines={1} lastLineWidth="80%" />
        </div>
      )}
    </div>
  )
}

// Content area skeleton
export function ContentAreaSkeleton({
  className,
  showHeader = true,
  formSections = 3,
  fieldRows = 3
}: {
  className?: string
  showHeader?: boolean
  formSections?: number
  fieldRows?: number
}) {
  return (
    <div className={cn('p-4 lg:p-6 bg-background min-h-full', className)}>
      {showHeader && (
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      )}

      <div className="space-y-6">
        {Array.from({ length: formSections }, (_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>

            <div className="grid gap-4">
              {Array.from({ length: fieldRows }, (_, fieldIndex) => (
                <div key={fieldIndex} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>

            {sectionIndex < formSections - 1 && (
              <div className="border-b border-border pt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}