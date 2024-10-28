import { Dream, Goal, ItemResponse, Task } from "@/types/itemTypes"
import { AddNewItemType, DeleteItemData } from "@/api/endpoints/itemAPITypes"
import { getRandomId } from "@/utils/randomId"
import {
  NewDreamType,
  NewGoalType,
  NewTaskType,
} from "@/components/itemModal/itemForms/schemas"

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
    } as ItemResponse
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
    } as ItemResponse
  }

  const dream = rest as NewDreamType

  return {
    ...common,
    target_date: dream.target_date,
    priority: dream.priority,
    // Clock metadata
    target_date__c: 0,
    priority__c: 0,
  } as ItemResponse
}

export function getAllAssociatedItems(
  items: ItemResponse[],
  parentItem: ItemResponse
) {
  let associatedItems = [parentItem]

  let temp = [parentItem]
  while (temp.length > 0) {
    const parentId = temp.pop()?.item_id
    const associated = items.filter(i => i.parent_id === parentId)
    temp = temp.concat(associated)
    associatedItems = associatedItems.concat(associated)
  }

  return associatedItems
}

export function findFormattedItem(
  allItems: {
    tasks: Task[]
    goals: Goal[]
    dreams: Dream[]
    rawItems: ItemResponse[]
  },
  itemId?: string | null
) {
  if (!itemId) return undefined

  const itemType = allItems.rawItems.find(i => i.item_id === itemId)?.item_type
  if (!itemType) return undefined

  return itemType === "TASK"
    ? allItems.tasks.find(i => i.item_id === itemId)
    : itemType === "GOAL"
      ? allItems.goals.find(i => i.item_id === itemId)
      : allItems.dreams.find(i => i.item_id === itemId)
}
