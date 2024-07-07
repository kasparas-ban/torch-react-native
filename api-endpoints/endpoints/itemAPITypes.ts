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

export type DeleteItemReq = {
  deleteItemId: string
  deleteAssociated: boolean
}

export type UpdateItemProgressReq = {
  id: string
  time_spent: number
}

export type UpdateItemStatusReq = {
  id: string
  status: ItemStatus
  updateAssociated: boolean
  itemType: ItemType
}
