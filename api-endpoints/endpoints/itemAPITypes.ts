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

export type FormattedUpdateItemType = Omit<UpdateItemType, "goal" | "recurring">

export type AddNewItemType = NewItemType & { type: ItemType }

export type DeleteItemData = {
  item_id: string
  cl: number
}

export type DeleteItemReq = DeleteItemData & {
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
