import { DeleteItemData } from "@/api-endpoints/endpoints/itemAPITypes"
import useWs from "@/stores/websocketStore"
import { useNetInfo } from "@react-native-community/netinfo"
import { ItemResponse, SyncMetadata } from "@/types/itemTypes"

import { getDeleteOp, getInsertOp, getUpdateOp } from "./opFormatters"

export default function useItemsSync() {
  const { ws } = useWs()
  const netInfo = useNetInfo()
  const isOnline = netInfo.isConnected && netInfo.isInternetReachable

  const addItem = (item: ItemResponse) => {
    if (!isOnline || !ws) return
    const insertOp = getInsertOp(item)
    ws.send(JSON.stringify(insertOp))
  }

  const updateItem = (newItem: SyncMetadata<ItemResponse>) => {
    if (!isOnline || !ws) return
    const updateOp = getUpdateOp(newItem)
    ws.send(JSON.stringify(updateOp))
  }

  const deleteItem = (data: DeleteItemData) => {
    if (!isOnline || !ws) return
    const deleteOp = getDeleteOp(data)
    ws.send(JSON.stringify(deleteOp))
  }

  return { addItem, updateItem, deleteItem }
}
