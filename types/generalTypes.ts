import { ReactNode } from "react"

export type SelectOption<T> = { label: string; value: T }

export type GroupedOption<T> = {
  label: string
  options: SelectOption<T>[]
}

export type SelectOptionExtended<T> = SelectOption<T> & {
  icon?: string | ReactNode
}
