import {
  AddNewItemType,
  DeleteItemData,
} from "@/api-endpoints/endpoints/itemAPITypes"
import { ItemResponse, SyncMetadata } from "@/types/itemTypes"
import { getRandomId } from "@/utils/randomId"
import {
  NewDreamType,
  NewGoalType,
  NewTaskType,
} from "@/components/itemModal/itemForms/schemas"

const defaultUpdateMetadata = {
  title: false,
  status: false,
  target_date: false,
  priority: false,
  duration: false,
  time_spent: false,
  rec_times: false,
  rec_period: false,
  rec_progress: false,
  parent_id: false,
}

export function formatNewItem(item: AddNewItemType, item_id?: string) {
  const { type, ...rest } = item

  const common = {
    item_id: item_id || getRandomId(),
    title: item.title,
    item_type: type,
    status: "ACTIVE",
    time_spent: 0,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    // Clock metadata
    title__c: 0,
    status__c: 0,
    time_spent__c: 0,
    item__c: 0,
  }

  if (type === "TASK") {
    const task = rest as NewTaskType

    return {
      ...common,
      target_date: task.target_date,
      priority: task.priority,
      duration: task.duration,
      rec_times: task.recurring?.times,
      rec_period: task.recurring?.period,
      rec_progress: 0,
      rec_updated_at: null,
      parent_id: task.parent_id,
      // Clock metadata
      target_date__c: 0,
      priority__c: 0,
      duration__c: 0,
      rec_times__c: 0,
      rec_period__c: 0,
      rec_progress__c: 0,
      parent_id__c: 0,
      // Update metadata
      updatedFields: defaultUpdateMetadata,
    } as SyncMetadata<ItemResponse>
  }

  if (type === "GOAL") {
    const goal = rest as NewGoalType

    return {
      ...common,
      target_date: goal.target_date,
      priority: goal.priority,
      parent_id: goal.parent_id,
      // Clock metadata
      target_date__c: 0,
      priority__c: 0,
      parent_id__c: 0,
      // Update metadata
      updatedFields: defaultUpdateMetadata,
    } as SyncMetadata<ItemResponse>
  }

  const dream = rest as NewDreamType

  return {
    ...common,
    target_date: dream.target_date,
    priority: dream.priority,
    // Clock metadata
    target_date__c: 0,
    priority__c: 0,
    // Update metadata
    updatedFields: defaultUpdateMetadata,
  } as SyncMetadata<ItemResponse>
}

export function getAllAssociatedItems(
  items: ItemResponse[],
  data: DeleteItemData
) {
  const associatedIds = [data]

  const temp = [data]
  while (temp.length !== 0) {
    const associated = items
      .filter(i => i.parent_id === temp.pop()?.item_id)
      .map(i => ({ item_id: i.item_id, cl: i.item__c }))
    temp.concat(associated)
    associatedIds.concat(associated)
  }

  return associatedIds
}
