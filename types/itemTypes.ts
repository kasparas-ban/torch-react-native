// === Items ===

import { ItemRecord } from "@/library/powersync/AppSchema"

export type GeneralItem = {
  itemID: string
  title: string
  type: ItemType
  status: ItemStatus
  timeSpent: number
  targetDate: string | null
  priority: "LOW" | "MEDIUM" | "HIGH" | null
  duration: number | null
  parentID: string | null
  recurring: {
    period: ReccuringPeriod
    times: number
    progress: number
    updatedAt: string | null
  } | null
  updatedAt: string
  createdAt: string
}

type CommonItem = {
  itemID: string
  title: string
  type: ItemType
  status: ItemStatus
  timeSpent: number
  targetDate: string | null
  priority: "LOW" | "MEDIUM" | "HIGH" | null
  updatedAt: string
  createdAt: string
  // Additional field
  progress: number
}

export type Task = CommonItem & {
  duration: number | null
  parent: Omit<Goal, "tasks" | "parent"> | null
  recurring: {
    period: ReccuringPeriod
    times: number
    progress: number
    updatedAt: string | null
  } | null
}

export type Goal = CommonItem & {
  parent: Omit<Dream, "goals"> | null
  // Additional fields
  totalTimeSpent: number
  tasks: Omit<Task, "parent">[]
}

export type Dream = CommonItem & {
  // Additional fields
  totalTimeSpent: number
  goals: Omit<Goal, "parent" | "tasks">[]
}

export type FormattedItem = Task | Goal | Dream

// === Rest ===

export type GroupedItems<T> = {
  [parent_id: number | string | "empty" | "other"]: {
    parentLabel?: string
    items: T[]
  }
}

export type FormattedItems = {
  tasks: Task[]
  goals: Goal[]
  dreams: Dream[]
  rawItems: ItemRecord[]
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
  time_spent?: number
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
  time_spent: number
  focusOn?: { label: string; value: string; type: ItemType }
  progress?: number
  progressDifference?: number
  startTime: string
  finishTime: string
}
