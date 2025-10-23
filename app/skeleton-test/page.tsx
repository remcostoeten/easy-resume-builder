import {
  EditorSkeleton,
  LayersPanelSkeleton,
  SectionEditorSkeleton,
  SkillsEditorSkeleton,
  HeaderEditorSkeleton,
  EntryListSkeleton
} from '@/components/editor/skeletons'

export default function SkeletonTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Skeleton Loader Test Page</h1>

        <div className="space-y-12">
          {/* Editor Skeleton */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Editor Skeleton</h2>
            <div className="border border-border rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <EditorSkeleton />
            </div>
          </section>

          {/* Individual Component Skeletons */}
          <div className="grid lg:grid-cols-2 gap-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Layers Panel Skeleton</h2>
              <div className="border border-border rounded-lg" style={{ height: '400px' }}>
                <LayersPanelSkeleton />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Section Editor Skeleton</h2>
              <div className="border border-border rounded-lg p-4">
                <SectionEditorSkeleton />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Skills Editor Skeleton</h2>
              <div className="border border-border rounded-lg p-4">
                <SkillsEditorSkeleton />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Header Editor Skeleton</h2>
              <div className="border border-border rounded-lg p-4">
                <HeaderEditorSkeleton />
              </div>
            </section>
          </div>

          {/* Entry List Skeleton */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Entry List Skeleton</h2>
            <div className="border border-border rounded-lg p-4">
              <EntryListSkeleton entries={3} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}