"use client"

import { Type, Layout, Ruler } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"

export type ResumeStyle = {
  layout: "single" | "two-column" | "modern"
  fontFamily: "serif" | "sans" | "mono"
  fontSize: number
  spacing: "compact" | "normal" | "spacious"
  colorScheme: "default" | "minimal" | "professional"
}

interface StylePanelProps {
  style: ResumeStyle
  onChange: (style: ResumeStyle) => void
}

export function StylePanel({ style, onChange }: StylePanelProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-4">
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Layout className="h-4 w-4" />
            Layout Template
          </Label>
          <Select value={style.layout} onValueChange={(value: any) => onChange({ ...style, layout: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Column</SelectItem>
              <SelectItem value="two-column">Two Column</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Type className="h-4 w-4" />
            Font Family
          </Label>
          <Select value={style.fontFamily} onValueChange={(value: any) => onChange({ ...style, fontFamily: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="serif">Serif (Traditional)</SelectItem>
              <SelectItem value="sans">Sans-Serif (Modern)</SelectItem>
              <SelectItem value="mono">Monospace (Technical)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2">Font Size: {style.fontSize}px</Label>
          <Slider
            value={[style.fontSize]}
            onValueChange={([value]) => onChange({ ...style, fontSize: value })}
            min={10}
            max={16}
            step={1}
          />
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Ruler className="h-4 w-4" />
            Spacing
          </Label>
          <Select value={style.spacing} onValueChange={(value: any) => onChange({ ...style, spacing: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="spacious">Spacious</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2">Color Scheme</Label>
          <Select value={style.colorScheme} onValueChange={(value: any) => onChange({ ...style, colorScheme: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
    </div>
  )
}
