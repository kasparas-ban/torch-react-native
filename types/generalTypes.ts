import { memo, ReactNode } from "react"

export type SelectOption<T> = { label: string; value: T }

export type GroupedOption<T> = {
  label: string
  options: SelectOption<T>[]
}

export type SelectOptionExtended<T> = SelectOption<T> & {
  icon?: string | ReactNode
}

export const genericMemo: <T>(component: T) => T = memo

export type Stringified<T> = {
  [Property in keyof T]-?: T[Property]
}
