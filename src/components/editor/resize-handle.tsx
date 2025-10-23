"use client"

interface ResizeHandleProps {
  onMouseDown: () => void
  isResizing: boolean
}

export function ResizeHandle({ onMouseDown, isResizing }: ResizeHandleProps) {
  return (
    <div
      className="group relative w-1 cursor-ew-resize bg-border transition-colors hover:bg-primary"
      onMouseDown={onMouseDown}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize preview panel"
    >
      <div className={`absolute inset-y-0 -left-1 -right-1 ${isResizing ? "bg-primary/20" : ""}`} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border p-1 opacity-0 transition-opacity group-hover:opacity-100">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-muted-foreground"
        >
          <path d="M6 4L6 12M10 4L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
