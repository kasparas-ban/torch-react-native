import { DeleteItemData } from "@/api-endpoints/endpoints/itemAPITypes"
import useWs from "@/stores/websocketStore"
import { ItemResponse } from "@/types/itemTypes"
import useDev from "@/components/dev/useDev"

import { getDeleteOp, getInsertOp, getUpdateOp } from "./opFormatters"

export default function useItemsSync() {
  const { ws } = useWs()
  const { isOnline } = useDev()

  const addItem = (item: ItemResponse) => {
    if (!isOnline || !ws) return
    const insertOp = getInsertOp(item)
    ws.send(JSON.stringify(insertOp))
  }

  const updateItem = (oldItem: ItemResponse, newItem: ItemResponse) => {
    if (!isOnline || !ws) return
    const updateOp = getUpdateOp(oldItem, newItem)
    ws.send(JSON.stringify(updateOp))
  }

  const deleteItem = (data: DeleteItemData) => {
    if (!isOnline || !ws) return
    const deleteOp = getDeleteOp(data)
    ws.send(JSON.stringify(deleteOp))
  }

  return { addItem, updateItem, deleteItem }
}
