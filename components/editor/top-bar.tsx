"use client"

import { useState } from "react"
import {
  Save,
  Undo,
  Redo,
  FileText,
  Eye,
  Edit,
  Columns,
  Download,
  Upload,
  Palette,
  Pencil,
  Check,
  X,
  Sparkles,
  Settings,
  Sun,
  Moon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { exportToPDF } from "../../lib/utils/pdf-export"
import type { Resume, SavedResume } from "../../lib/types/resume"
import { toast } from "sonner"
import { resumeTemplates } from "../../lib/utils/resume-templates"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { LazyStylePanel, LazyThemePicker } from "./lazy-components"
import type { ResumeStyle } from "./style-panel"
import { useThemeSwitcher } from "@/lib/hooks/use-theme-switcher"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type ViewMode = "edit" | "preview" | "split"

interface TopBarProps {
  resume: Resume
  onSave: (name: string) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  savedResumes: SavedResume[]
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  resumeStyle: ResumeStyle
  onStyleChange: (style: ResumeStyle) => void
  onNameChange?: (name: string) => void
  onLoadTemplate?: (resume: Resume) => void
  onAutoFocusFirstField?: () => void
  onExportResume?: () => void
  onImportResume?: () => void
}

export function TopBar({
  resume,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  savedResumes,
  viewMode,
  onViewModeChange,
  resumeStyle,
  onStyleChange,
  onNameChange,
  onLoadTemplate,
  onAutoFocusFirstField,
  onExportResume,
  onImportResume,
}: TopBarProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [styleDialogOpen, setStyleDialogOpen] = useState(false) // Added state for style dialog
  const [resumeName, setResumeName] = useState(resume.name)
  const [isExporting, setIsExporting] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(resume.name)

  const { isDark, toggleDarkMode } = useThemeSwitcher()

  const handleSave = () => {
    onSave(resumeName)
    setSaveDialogOpen(false)
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportToPDF(resume.name)
      toast.success("PDF exported", {
        description: `"${resume.name}" has been downloaded.`,
      })
    } catch (error) {
      console.error("Failed to export PDF:", error)
      toast.error("Failed to export PDF", {
        description: "There was an error exporting your resume to PDF.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleNameEdit = () => {
    setEditedName(resume.name)
    setIsEditingName(true)
  }

  const handleNameSave = () => {
    if (editedName.trim() && editedName !== resume.name) {
      onNameChange?.(editedName.trim())
    }
    setIsEditingName(false)
  }

  const handleNameCancel = () => {
    setEditedName(resume.name)
    setIsEditingName(false)
  }

  const handleLoadTemplate = (templateId: string) => {
    const template = resumeTemplates.find((t) => t.id === templateId)
    if (template && onLoadTemplate) {
      const newResume = template.createResume()
      onLoadTemplate(newResume)

      // Auto-focus the first editable field after a short delay
      setTimeout(() => {
        onAutoFocusFirstField?.()
      }, 100)

      toast.success("Template loaded", {
        description: `"${template.name}" template has been loaded with example data.`,
      })
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-3">
        <FileText className="h-5 w-5 shrink-0 text-primary" />
        <h1 className="shrink-0 text-lg font-semibold text-card-foreground">Resume Builder</h1>
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSave()
                if (e.key === "Escape") handleNameCancel()
              }}
              className="h-7 w-48 text-sm"
              autoFocus
            />
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={handleNameSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={handleNameCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            onClick={handleNameEdit}
            className="group flex min-w-0 items-center gap-2 rounded px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
          >
            <span className="truncate">• {resume.name}</span>
            <Pencil className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <TooltipProvider>
          {/* Load Example Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Load Example
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-2 py-1.5">
                <p className="text-sm font-semibold">Example Templates</p>
                <p className="text-xs text-muted-foreground">Load pre-filled resume examples</p>
              </div>
              <DropdownMenuSeparator />
              {resumeTemplates.map((template) => (
                <DropdownMenuItem key={template.id} onClick={() => handleLoadTemplate(template.id)}>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{template.name}</span>
                    <span className="text-xs text-muted-foreground">{template.description}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-6 w-px bg-border" />

          {/* View Mode Toggle */}
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && onViewModeChange(value as ViewMode)}
            className="gap-0"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="edit" aria-label="Edit mode" className="gap-1.5">
                  <Edit className="h-4 w-4" />
                  <span className="hidden lg:inline">Edit</span>
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Edit mode</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="split" aria-label="Split view" className="gap-1.5">
                  <Columns className="h-4 w-4" />
                  <span className="hidden lg:inline">Split</span>
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Split view</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="preview" aria-label="Preview mode" className="gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span className="hidden lg:inline">Preview</span>
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Preview mode</TooltipContent>
            </Tooltip>
          </ToggleGroup>

          <div className="h-6 w-px bg-border" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onUndo} disabled={!canUndo}>
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRedo} disabled={!canRedo}>
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>

          <div className="h-6 w-px bg-border" />

          {/* Style Panel */}
          <Dialog open={styleDialogOpen} onOpenChange={setStyleDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Palette className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Resume style</TooltipContent>
            </Tooltip>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Resume Styling</DialogTitle>
                <DialogDescription>Customize the appearance of your resume</DialogDescription>
              </DialogHeader>
              <LazyStylePanel style={resumeStyle} onChange={onStyleChange} />
            </DialogContent>
          </Dialog>

          <div className="h-6 w-px bg-border" />

          {/* Dark Mode Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleDarkMode}>
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isDark ? "Light mode" : "Dark mode"}</TooltipContent>
          </Tooltip>

          <div className="h-6 w-px bg-border" />

          {/* Settings */}
          <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Application Settings</DialogTitle>
                <DialogDescription>Customize your resume builder experience</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <LazyThemePicker />
              </div>
            </DialogContent>
          </Dialog>

          <div className="h-6 w-px bg-border" />

          {/* Export PDF */}
          <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "PDF"}
          </Button>

          {/* Export JSON */}
          <Button variant="outline" size="sm" onClick={onExportResume} disabled={!resume}>
            <Download className="mr-2 h-4 w-4" />
            JSON
          </Button>

          {/* Import JSON */}
          <Button variant="outline" size="sm" onClick={onImportResume}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>

          <div className="h-6 w-px bg-border" />

          {/* Save Resume */}
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Resume</DialogTitle>
                <DialogDescription>Give your resume a name to save it to your account.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="resume-name">Resume Name</Label>
                  <Input
                    id="resume-name"
                    value={resumeName}
                    onChange={(e) => setResumeName(e.target.value)}
                    placeholder="My Professional Resume"
                  />
                </div>
                {savedResumes.length > 0 && (
                  <div className="space-y-2">
                    <Label>Previously Saved Resumes</Label>
                    <div className="max-h-32 space-y-1 overflow-auto rounded-md border border-border p-2">
                      {savedResumes.map((saved) => (
                        <div key={saved.id} className="text-sm text-muted-foreground">
                          {saved.name} - {new Date(saved.savedAt).toLocaleDateString()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TooltipProvider>
      </div>
    </div>
  )
}
