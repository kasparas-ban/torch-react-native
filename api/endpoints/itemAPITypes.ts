import { ItemStatus, ItemType } from "@/types/itemTypes"
import {
  NewDreamType,
  NewGoalType,
  NewTaskType,
  UpdateDreamType,
  UpdateGoalType,
  UpdateTaskType,
} from "@/components/itemModal/itemForms/schemas"

export type UpsertItem = NewItemType | UpdateItemType
export type NewItemType = NewTaskType | NewGoalType | NewDreamType
export type UpdateItemType = UpdateTaskType | UpdateGoalType | UpdateDreamType

export type FormattedUpdateItemType =
  | Omit<UpdateTaskType, "goal" | "recurring">
  | Omit<UpdateGoalType, "dream">
  | UpdateDreamType

export type AddNewItemType = NewItemType & { type: ItemType }

export type DeleteItemData = {
  item_id: string
  cl: number
}

export type DeleteItemReq = {
  item_id: string
  deleteAssociated: boolean
}

export type UpdateItemProgressReq = {
  item_id: string
  time_spent: number
}

export type UpdateItemStatusReq = {
  item_id: string
  status: ItemStatus
  updateAssociated: boolean
  itemType: ItemType
}

export type ElapsedTimeData = {
  item_id: string
  elapsedTime: number
}
