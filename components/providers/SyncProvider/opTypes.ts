import { ItemStatus, ItemType, ReccuringPeriod } from "@/types/itemTypes"

export type InsertOp = {
  op: "INSERT"
  id: string
  data: {
    title: string
    item_type: ItemType
    status?: ItemStatus
    time_spent?: number
    target_date?: string | null
    priority?: "LOW" | "MEDIUM" | "HIGH" | null
    duration?: number | null
    parent_id?: string | null
    created_at?: string
  }
}

export type UpdateOp = {
  op: "UPDATE"
  id: string
  diffs: FieldDiff
}

export type UpdateDiffs = {
  status?: ItemStatus
  time_spent?: number
  target_date?: string
  priority?: "LOW" | "MEDIUM" | "HIGH"
  duration?: number
  parent_id?: string
  rec_times?: number
  rec_period?: ReccuringPeriod
  rec_progress?: number
  rec_updated_at?: string
}

export type FieldDiff = {
  [key in keyof UpdateDiffs]: {
    val: UpdateDiffs[key]
    cl: number
  }
}

export type DeleteOp = {
  op: "DELETE"
  id: string
  cl: number
}
