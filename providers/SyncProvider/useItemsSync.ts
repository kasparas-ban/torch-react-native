import useDev from "@/devTools/useDev"
import { wsStore } from "@/stores/websocketStore"
import { ItemResponse } from "@/types/itemTypes"
import { DeleteItemData } from "@/api/endpoints/itemAPITypes"

import { getDeleteOp, getInsertOp, getUpdateOp } from "./opFormatters"

export default function useItemsSync() {
  const { isOnline } = useDev()

  const addItem = (item: ItemResponse) => {
    const ws = wsStore.getState().ws
    if (!isOnline || !ws) return
    const insertOp = getInsertOp(item)
    ws.send(JSON.stringify(insertOp))
  }

  const updateItem = (oldItem: ItemResponse, newItem: ItemResponse) => {
    const ws = wsStore.getState().ws
    if (!isOnline || !ws) return
    const updateOp = getUpdateOp(oldItem, newItem)
    ws.send(JSON.stringify(updateOp))
  }

  const deleteItem = (data: DeleteItemData) => {
    const ws = wsStore.getState().ws
    if (!isOnline || !ws) return
    const deleteOp = getDeleteOp(data)
    ws.send(JSON.stringify(deleteOp))
  }

  return { addItem, updateItem, deleteItem }
}
