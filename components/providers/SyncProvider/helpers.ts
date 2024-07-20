import { DeleteItemData } from "@/api-endpoints/endpoints/itemAPITypes"
import {
  ItemResponse,
  ItemStatus,
  ItemType,
  ReccuringPeriod,
} from "@/types/itemTypes"

import { getDeleteOp, getInsertOp, getUpdateOp } from "./opFormatters"

type InsertOp = {
  op: "INSERT"
  item_id: string
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
  item_id: string
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
}

type FieldDiff = {
  [key in keyof UpdateDiffs]: {
    val: UpdateDiffs[key]
    cl: number
  }
}

type IncomingDeleteOp = {
  op: "DELETE"
  item_id: string
}

type ServerOp = (IncomingInsertOp | IncomingUpdateOp | IncomingDeleteOp) & {
  wsId: string
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
  remoteItems: ItemResponse[],
  localItems: ItemResponse[]
) {
  const updateOps: UpdateOp[] = []

  updatedItems.forEach(id => {
    const localItem = localItems.find(i => i.item_id === id)
    const remoteItem = remoteItems.find(i => i.item_id === id)
    if (localItem && remoteItem && localItem.item__c >= remoteItem.item__c) {
      const updateOp = getUpdateOp(remoteItem, localItem)
      if (updateOp) updateOps.push(updateOp)
    }
  })

  return updateOps
}

export function handleServerMsg(
  op: ServerOp,
  wsId: string,
  addItem: (item: ItemResponse) => void,
  updateItem: (item: Partial<ItemResponse>) => void,
  deleteItem: (item_id: string) => void
) {
  console.log("Handling server msg: ", wsId, op)

  if (op.op === "INSERT") {
    const newItem = {
      ...op.diffs,
      item_id: op.item_id,
    }
    addItem(newItem)
  }

  if (op.op === "UPDATE") {
    const newItem = { item_id: op.item_id, ...op.diffs }
    updateItem(newItem)
  }

  if (op.op === "DELETE") {
    deleteItem(op.item_id)
  }
}
