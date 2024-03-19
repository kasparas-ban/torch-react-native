import { ReactNode } from "react"

export type SelectOption<T> = { label: string; value: T }

export type SelectOptionExtended<T> = SelectOption<T> & {
  icon: string | ReactNode
}
