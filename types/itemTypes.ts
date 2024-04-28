// === Items ===

import { SyncMetadata } from "./generalTypes"

export type ResponseItem = {
  itemID: string
  title: string
  type: ItemType
  targetDate: string | null
  priority: "LOW" | "MEDIUM" | "HIGH" | null
  duration: number | null
  recurring: RecurringType | null
  parentID: string | null
  timeSpent: number
  status: ItemStatus
  createdAt: string
}

export type GeneralItem = Omit<ResponseItem, "parentID"> & {
  progress: number
}

export type Task = GeneralItem & {
  goal: GeneralItem | null
}

export type Goal = GeneralItem & {
  totalTimeSpent: number
  tasks: GeneralItem[]
  dream: GeneralItem | null
}

export type Dream = GeneralItem & {
  totalTimeSpent: number
  goals: GeneralItem[]
}

export type FormattedItem = Task | Goal | Dream

// === Rest ===

export type GroupedItems<T> = {
  [parentId: number | string | "empty" | "other"]: {
    parentLabel?: string
    items: T[]
  }
}

export type FormattedItems = {
  tasks: Task[]
  goals: Goal[]
  dreams: Dream[]
  rawItems: SyncMetadata<ResponseItem>[]
}

export type ItemTypeLabel = "Tasks" | "Goals" | "Dreams"

export type ItemType = "TASK" | "GOAL" | "DREAM"

export type ItemStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED"

export type ItemOptionType = {
  value: string
  label: string
  type: ItemType
  containsTasks: boolean
  progress?: number
  timeSpent?: number
  totalTimeSpent?: number
  duration?: number
}

export type GroupedOptionType = {
  value: string
  label: string
  options: Array<ItemOptionType & { parent?: string }>
}

export type TimerState = "idle" | "paused" | "running"

export type RecurringType = {
  times: number
  period: ReccuringPeriod
  progress: number
}

export type ReccuringPeriod = "DAY" | "WEEK" | "MONTH"

export type TimerHistoryRecord = {
  timeSpent: number
  focusOn?: { label: string; value: string; type: ItemType }
  progress?: number
  progressDifference?: number
  startTime: string
  finishTime: string
}
