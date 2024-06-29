import { DeleteItemData } from "@/api-endpoints/endpoints/itemAPITypes"
import { Platform } from "react-native"
import {
  ItemResponse,
  ItemStatus,
  ItemType,
  ReccuringPeriod,
  SyncMetadata,
  UpdatedFields,
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
  wsId: number
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
    const isExisting = remoteItems.find(i => i.item_id === item.item_id)
    if (isExisting) return false

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
  remoteItems: ItemResponse[],
  localItems: SyncMetadata<ItemResponse>[]
) {
  const updateOps: UpdateOp[] = []

  remoteItems.forEach(remoteItem => {
    const localItem = localItems.find(i => i.item_id === remoteItem.item_id)
    if (!localItem) return

    const updateOp = getUpdateOp(localItem)
    if (updateOp) updateOps.push(updateOp)
  })

  return updateOps
}

export function addMetadata(
  items: ItemResponse[]
): SyncMetadata<ItemResponse>[] {
  return items.map(item => ({
    ...item,
    updatedFields: getDefaultMetadata(),
  }))
}

export function getDefaultMetadata(): UpdatedFields {
  return {
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
}

export function handleServerMsg(
  op: ServerOp,
  addItem: (item: SyncMetadata<ItemResponse>) => void,
  updateItem: (data: Partial<ItemResponse>) => void,
  deleteItem: (item_id: string) => void
) {
  console.log("Handling server msg: ", Platform.OS, op)

  if (op.op === "INSERT") {
    const newItem = { ...op.diffs, updatedFields: getDefaultMetadata() }
    addItem(newItem)
  }

  if (op.op === "UPDATE") {
    updateItem({ item_id: op.item_id, ...op.diffs })
  }

  if (op.op === "DELETE") {
    deleteItem(op.item_id)
  }
}
