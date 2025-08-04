import type { ReactNode } from "react"
import type { TSectionType } from "./resume"

export type TSectionConfig<T = unknown> = {
  readonly type: TSectionType
  readonly title: string
  readonly icon: ReactNode
  readonly isRequired: boolean
  readonly defaultOrder: number
}

export type TFormSectionProps<T = unknown> = {
  readonly data: T
  readonly onUpdate: (data: Partial<T>) => void
  readonly onAdd?: () => void
  readonly onRemove?: (id: string) => void
}

export type TPreviewSectionProps<T = unknown> = {
  readonly data: T
  readonly isVisible: boolean
}

export type TSectionFactory<T = unknown> = {
  readonly config: TSectionConfig<T>
  readonly FormComponent: (props: TFormSectionProps<T>) => ReactNode
  readonly PreviewComponent: (props: TPreviewSectionProps<T>) => ReactNode
}
