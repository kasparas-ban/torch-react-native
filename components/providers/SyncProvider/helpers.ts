import {
  ItemResponse,
  ItemStatus,
  ItemType,
  ReccuringPeriod,
} from "@/types/itemTypes"
import { ProfileResp } from "@/types/userTypes"
import { DeleteItemData, ElapsedTimeData } from "@/api/endpoints/itemAPITypes"

import { getDeleteOp, getInsertOp, getUpdateOp } from "./opFormatters"

type InsertOp = {
  op: "INSERT"
  row_id: string
  table: "users" | "items"
  data: {
    title: string
    item_type: ItemType
    status?: ItemStatus
    time_spent?: number
    target_date?: string | null
    priority?: "LOW" | "MEDIUM" | "HIGH" | null
    duration?: number | null
    parent_id?: string | null
    created_at?: string
  }
}

type UpdateOp = {
  op: "UPDATE"
  row_id: string
  table: "users" | "items"
  diffs: FieldDiff
}

type UpdateDiffs = {
  status?: ItemStatus
  time_spent?: number
  target_date?: string
  priority?: "LOW" | "MEDIUM" | "HIGH"
  duration?: number
  parent_id?: string
  rec_times?: number
  rec_period?: ReccuringPeriod
  rec_progress?: number
  rec_updated_at?: string
  focus_time?: number
}

type FieldDiff = {
  [key in keyof UpdateDiffs]: {
    val: UpdateDiffs[key]
    cl: number
  }
}

type IncomingDeleteOp = {
  op: "DELETE"
  table: "users" | "items"
  row_id: string
}

type ServerOp = (IncomingInsertOp | IncomingUpdateOp | IncomingDeleteOp) & {
  wsID: string
}

type IncomingInsertOp = Omit<InsertOp, "data"> & { diffs: ItemResponse }
type IncomingUpdateOp = Omit<UpdateOp, "diffs"> & {
  diffs: Partial<ItemResponse>
}

export function getDeleteOps(
  remoteItems: ItemResponse[],
  deletedItems: DeleteItemData[]
) {
  const itemsToDelete: DeleteItemData[] = []
  deletedItems.forEach(i => {
    const remoteItem = remoteItems.find(item => item.item_id === i.item_id)
    if (!remoteItem || remoteItem.item__c > i.cl) return
    itemsToDelete.push(i)
  })

  const deleteOps = itemsToDelete.map(item => getDeleteOp(item))

  return deleteOps
}

export function getInsertOps(
  remoteItems: ItemResponse[],
  localItems: ItemResponse[],
  lastSyncItems: ItemResponse[]
) {
  const insertItems = localItems.filter(item => {
    const remoteItem = remoteItems.find(i => i.item_id === item.item_id)
    if (remoteItem) return false

    const lastSyncedItem = lastSyncItems.find(i => i.item_id === item.item_id)
    if (lastSyncedItem) {
      // The item was deleted from the DB. Check if it was updated since last sync
      const isChanged = JSON.stringify(lastSyncedItem) !== JSON.stringify(item)
      return isChanged
    }

    return true
  })

  const insertOps: InsertOp[] = insertItems.map(i => getInsertOp(i))

  return insertOps
}

export function getUpdateOps(
  updatedItems: string[],
  elapsedTime: ElapsedTimeData[],
  remoteItems: ItemResponse[],
  localItems: ItemResponse[]
) {
  let updateOps: UpdateOp[] = []

  updatedItems.forEach(id => {
    const localItem = localItems.find(i => i.item_id === id)
    const remoteItem = remoteItems.find(i => i.item_id === id)
    if (localItem && remoteItem && localItem.item__c >= remoteItem.item__c) {
      const updateOp = getUpdateOp(remoteItem, localItem)
      if (updateOp) updateOps.push(updateOp)
    }
  })

  elapsedTime.forEach(data => {
    const localItem = localItems.find(i => i.item_id === data.item_id)
    const remoteItem = remoteItems.find(i => i.item_id === data.item_id)
    if (!remoteItem || !localItem) return

    let isAlreadyUpdated = false
    updateOps = updateOps.map(op => {
      if (data.item_id === op.row_id) {
        isAlreadyUpdated = true
        return {
          ...op,
          diffs: {
            ...op.diffs,
            time_spent: {
              val: remoteItem.time_spent + data.elapsedTime,
              cl: remoteItem.time_spent__c,
            },
          },
        }
      }

      return op
    })

    if (!isAlreadyUpdated) {
      const localItem = localItems.find(i => i.item_id === data.item_id)
      const remoteItem = remoteItems.find(i => i.item_id === data.item_id)
      if (!localItem || !remoteItem) return updateOps

      const newItem = {
        ...localItem,
        time_spent: localItem.time_spent + data.elapsedTime,
      }
      const updateOp = getUpdateOp(remoteItem, newItem)
      if (updateOp) updateOps.push(updateOp)
    }
  })

  return updateOps
}

export function handleServerMsg(
  op: ServerOp,
  wsId: string,
  updateUser: (user: Partial<ProfileResp>) => void,
  addItem: (item: ItemResponse) => void,
  updateItem: (item: Partial<ItemResponse>) => void,
  deleteItem: (item_id: string) => void
) {
  console.log("Handling server msg: ", wsId, op)

  if (op.table === "users" && op.op === "UPDATE") {
    updateUser(op.diffs)
  }

  if (op.op === "INSERT") {
    const newItem = {
      ...op.diffs,
      item_id: op.row_id,
    }
    addItem(newItem)
  }

  if (op.op === "UPDATE") {
    const newItem = { item_id: op.row_id, ...op.diffs }
    updateItem(newItem)
  }

  if (op.op === "DELETE") {
    deleteItem(op.row_id)
  }
}

export function getUserUpdateOp(
  currentData: ProfileResp,
  incommingData: ProfileResp,
  elapsedTime: number
) {
  if (!elapsedTime) return null

  const updateOp: UpdateOp = {
    op: "UPDATE",
    table: "users",
    row_id: currentData.user_id,
    diffs: {
      focus_time: {
        val: incommingData.focus_time + elapsedTime,
        cl: incommingData.focus_time__c,
      },
    },
  }

  return updateOp
}
