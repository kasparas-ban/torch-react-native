import { AddNewItemType } from "@/api-endpoints/endpoints/itemAPITypes"
import { ItemRecord } from "@/library/powersync/AppSchema"
import { NewTaskType } from "@/components/itemModal/itemForms/schemas"

export function formatItemFormData(item: AddNewItemType) {
  const { type, ...rest } = item

  const newItem = rest as NewTaskType

  return {
    title: rest.title,
    type: type,
    targetDate: rest.targetDate || null,
    priority: rest.priority || null,
    duration: newItem.duration || null,
    parentID: newItem.parentID || null,
    recurring: newItem.recurring
      ? {
          period: newItem.recurring.period,
          times: newItem.recurring.times,
        }
      : null,
  }
}

export function getAllAssociatedItems(
  items: ItemRecord[],
  deleteItemId: string
) {
  const associatedIds = [deleteItemId]

  const temp = associatedIds
  while (temp.length !== 0) {
    const associated = items
      .filter(i => i.parent_id === temp.pop())
      .map(item => item.id)
    temp.concat(associated)
    associatedIds.concat(associated)
  }

  return associatedIds
}
