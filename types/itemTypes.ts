// === Items ===

export type ItemResponse = {
  item_id: string
  title: string
  item_type: ItemType
  status: ItemStatus
  target_date: string | null
  priority: "LOW" | "MEDIUM" | "HIGH" | null
  duration: number | null
  time_spent: number
  rec_times: number | null
  rec_period: ReccuringPeriod | null
  rec_progress: number | null
  rec_updated_at: string | null
  parent_id: string | null
  updated_at: string
  created_at: string
  // Clock metadata
  title__c: number
  status__c: number
  target_date__c: number
  priority__c: number
  duration__c: number
  time_spent__c: number
  rec_times__c: number
  rec_period__c: number
  rec_progress__c: number
  parent_id__c: number
  item__c: number
}

export type SyncMetadata<T> = T & {
  updatedFields: UpdatedFields
}

export type UpdatedFields = {
  title: boolean
  status: boolean
  target_date: boolean
  priority: boolean
  duration: boolean
  time_spent: boolean
  rec_times: boolean
  rec_period: boolean
  rec_progress: boolean
  parent_id: boolean
}

export type GeneralItem = Omit<ItemResponse, "parent_id"> & {
  progress: number
}

export type Task = GeneralItem & {
  goal: GeneralItem | null
}

export type Goal = GeneralItem & {
  totaltime_spent: number
  tasks: GeneralItem[]
  dream: GeneralItem | null
}

export type Dream = GeneralItem & {
  totaltime_spent: number
  goals: GeneralItem[]
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
  rawItems: SyncMetadata<ItemResponse>[]
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
  totaltime_spent?: number
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
