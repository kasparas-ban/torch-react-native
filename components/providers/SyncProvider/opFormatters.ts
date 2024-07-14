import { DeleteItemData } from "@/api-endpoints/endpoints/itemAPITypes"
import { ItemResponse } from "@/types/itemTypes"

import { DeleteOp, FieldDiff, InsertOp, UpdateOp } from "./opTypes"

export function getInsertOp(item: ItemResponse): InsertOp {
  return {
    op: "INSERT",
    item_id: item.item_id,
    data: {
      title: item.title,
      item_type: item.item_type,
      // Optional
      status: item.status,
      time_spent: item.time_spent,
      target_date: item.target_date,
      priority: item.priority,
      duration: item.duration,
      parent_id: item.parent_id,
      created_at: item.created_at,
    },
  }
}

export function getDeleteOp(item: DeleteItemData): DeleteOp {
  return {
    op: "DELETE",
    item_id: item.item_id,
    cl: item.cl,
  }
}

export function getUpdateOp(
  oldItem: ItemResponse,
  newItem: ItemResponse
): UpdateOp | null {
  let diffs: FieldDiff = {}

  let fieldsToUpdate = Object.keys(newItem).reduce(
    (prev, curr) => {
      const key = curr as keyof ItemResponse
      if (
        (newItem[key] === undefined || newItem[key] === null) &&
        (oldItem[key] === undefined || oldItem[key] === null)
      )
        return prev
      if (newItem[key] === oldItem[key]) return prev
      return [...prev, key]
    },
    [] as (keyof ItemResponse)[]
  )

  if (fieldsToUpdate.length === 0) return null

  fieldsToUpdate.forEach(field => {
    diffs = {
      ...diffs,
      [field]: {
        val: newItem[field],
        cl: newItem[(field + "__c") as keyof ItemResponse],
      },
    }
  })

  return {
    op: "UPDATE",
    item_id: newItem.item_id,
    diffs,
  }
}
