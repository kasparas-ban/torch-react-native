import { ItemResponse } from "@/types/itemTypes"
import { ProfileResp } from "@/types/userTypes"
import { DeleteItemData } from "@/api/endpoints/itemAPITypes"

import { DeleteOp, FieldDiff, InsertOp, UpdateOp } from "./opTypes"

export function getInsertOp(item: ItemResponse): InsertOp {
  return {
    op: "INSERT",
    row_id: item.item_id,
    table: "items",
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
    table: "items",
    row_id: item.item_id,
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
    row_id: newItem.item_id,
    table: "items",
    diffs,
  }
}

export function getUserUpdateOp(newData: ProfileResp): UpdateOp {
  return {
    op: "UPDATE",
    row_id: newData.user_id,
    table: "users",
    diffs: {
      focus_time: {
        val: newData.focus_time,
        cl: newData.focus_time__c,
      },
    },
  }
}
