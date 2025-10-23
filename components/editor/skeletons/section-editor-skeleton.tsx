import { SkeletonLoader, TextSkeleton } from '@/components/ui/skeleton-loader'

export function SectionEditorSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Section header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SkeletonLoader width="200px" height="32px" />
          <div className="flex gap-2">
            <SkeletonLoader width="100px" height="32px" />
            <SkeletonLoader width="100px" height="32px" />
          </div>
        </div>
        <TextSkeleton lines={1} lastLineWidth="50%" />
      </div>

      {/* Form sections */}
      <div className="space-y-6">
        <FormSectionSkeleton fields={3} title="Basic Information" />
        <FormSectionSkeleton fields={4} title="Details" showAddButton />
        <FormSectionSkeleton fields={2} title="Additional Information" />
      </div>
    </div>
  )
}

interface FormSectionSkeletonProps {
  fields?: number
  title?: string
  showAddButton?: boolean
  showHeader?: boolean
}

function FormSectionSkeleton({
  fields = 3,
  title = "Section",
  showAddButton = false,
  showHeader = true
}: FormSectionSkeletonProps) {
  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between border-b border-border pb-2">
          <SkeletonLoader width="150px" height="24px" />
          <div className="flex gap-2">
            {showAddButton && <SkeletonLoader width="80px" height="32px" />}
            <SkeletonLoader width="60px" height="32px" />
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {Array.from({ length: fields }, (_, i) => (
          <FieldSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

function FieldSkeleton() {
  const fieldType = Math.floor(Math.random() * 4)

  switch (fieldType) {
    case 0: // Text input
      return <InputFieldSkeleton />
    case 1: // Textarea
      return <TextareaFieldSkeleton />
    case 2: // Date fields
      return <DateFieldSkeleton />
    case 3: // Checkbox
      return <CheckboxFieldSkeleton />
    default:
      return <InputFieldSkeleton />
  }
}

function InputFieldSkeleton() {
  return (
    <div className="space-y-2">
      <SkeletonLoader width="120px" height="16px" />
      <SkeletonLoader className="h-10" />
    </div>
  )
}

function TextareaFieldSkeleton() {
  return (
    <div className="space-y-2">
      <SkeletonLoader width="120px" height="16px" />
      <SkeletonLoader className="h-24" />
    </div>
  )
}

function DateFieldSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <SkeletonLoader width="80px" height="16px" />
        <SkeletonLoader className="h-10" />
      </div>
      <div className="space-y-2">
        <SkeletonLoader width="80px" height="16px" />
        <SkeletonLoader className="h-10" />
      </div>
    </div>
  )
}

function CheckboxFieldSkeleton() {
  return (
    <div className="flex items-center space-x-3">
      <SkeletonLoader width="16px" height="16px" />
      <SkeletonLoader width="140px" height="16px" />
    </div>
  )
}

// Entry list skeleton for sections with multiple entries
export function EntryListSkeleton({
  entries = 3,
  title = "Entries"
}: {
  entries?: number
  title?: string
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonLoader width="120px" height="24px" />
        <SkeletonLoader width="100px" height="32px" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: entries }, (_, i) => (
          <EntrySkeleton key={i} entryNumber={i + 1} />
        ))}
      </div>

      <div className="flex justify-center">
        <SkeletonLoader width="120px" height="32px" />
      </div>
    </div>
  )
}

function EntrySkeleton({ entryNumber }: { entryNumber: number }) {
  return (
    <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-muted animate-pulse">
            <div className="h-3 w-3 rounded" />
          </div>
          <SkeletonLoader width="180px" height="20px" />
        </div>
        <div className="flex gap-2">
          <SkeletonLoader width="80px" height="32px" />
          <SkeletonLoader width="32px" height="32px" />
        </div>
      </div>

      <div className="grid gap-3 pl-9">
        <InputFieldSkeleton />
        <InputFieldSkeleton />
        <TextareaFieldSkeleton />
      </div>
    </div>
  )
}

// Skills specific skeleton
export function SkillsEditorSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SkeletonLoader width="200px" height="32px" />
          <div className="flex gap-2">
            <SkeletonLoader width="100px" height="32px" />
            <SkeletonLoader width="100px" height="32px" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <SkeletonLoader width="150px" height="24px" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <SkeletonLoader
                key={i}
                width={`${60 + Math.random() * 40}px`}
                height="32px"
                className="rounded-full"
              />
            ))}
          </div>
          <SkeletonLoader width="120px" height="32px" className="mx-auto" />
        </div>
      </div>
    </div>
  )
}

// Header specific skeleton
export function HeaderEditorSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SkeletonLoader width="200px" height="32px" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <InputFieldSkeleton />
              <InputFieldSkeleton />
              <InputFieldSkeleton />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-3">
              <InputFieldSkeleton />
              <TextareaFieldSkeleton />
              <TextareaFieldSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}