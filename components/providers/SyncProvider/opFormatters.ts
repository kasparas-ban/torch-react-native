import { DeleteItemData } from "@/api-endpoints/endpoints/itemAPITypes"
import { ItemResponse, SyncMetadata, UpdatedFields } from "@/types/itemTypes"

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
  newItem: SyncMetadata<ItemResponse>
): UpdateOp | null {
  let diffs: FieldDiff = {}

  const fieldsToUpdate = Object.entries(newItem.updatedFields)
    .filter(([_, val]) => val)
    .map(entry => entry[0]) as (keyof UpdatedFields)[]

  fieldsToUpdate.forEach(field => {
    diffs = {
      ...diffs,
      [field]: {
        val: newItem[field],
        cl: newItem[(field + "__c") as keyof UpdatedFields],
      },
    }
  })

  if (Object.keys(diffs).length === 0) return null

  return {
    op: "UPDATE",
    item_id: newItem.item_id,
    diffs,
  }
}
