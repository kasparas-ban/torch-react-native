import { ItemStatus, ItemType, ResponseItem } from "@/types/itemTypes"
import {
  NewDreamType,
  NewGoalType,
  NewTaskType,
  UpdateDreamType,
  UpdateGoalType,
  UpdateTaskType,
} from "@/components/itemModal/itemForms/schemas"

import { HOST } from "../utils/apiConfig"
import { handleFetch } from "../utils/helpers"

export type UpsertItem = NewItemType | UpdateItemType
export type NewItemType = NewTaskType | NewGoalType | NewDreamType
export type UpdateItemType = UpdateTaskType | UpdateGoalType | UpdateDreamType

export type DeleteItemReq = {
  itemID: string
  itemType: ItemType
  deleteAssociated: boolean
}

export type UpdateItemProgressReq = {
  itemID: string
  timeSpent: number
}

export type UpdateItemStatusReq = {
  itemID: string
  status: ItemStatus
  updateAssociated: boolean
  itemType: ItemType
}

export const addItem = (token: string, item: NewItemType, type: ItemType) =>
  fetch(`${HOST}/add-item/${type.toLowerCase()}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(item),
  }).then(res => handleFetch<ResponseItem>(res, "Failed to add item"))

export const updateItem = (
  token: string,
  item: UpdateItemType,
  type: ItemType
) =>
  fetch(`${HOST}/update-item/${type.toLowerCase()}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(item),
  }).then(res => handleFetch<ResponseItem>(res, "Failed to update item"))
