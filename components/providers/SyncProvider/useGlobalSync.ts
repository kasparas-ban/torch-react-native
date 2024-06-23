import { useEffect } from "react"
import { getAllItems } from "@/api-endpoints/endpoints/itemsAPI"
import useItems from "@/stores/itemStore"
import useWs from "@/stores/websocketStore"
import { useAuth } from "@clerk/clerk-expo"

import {
  addMetadata,
  getDeleteOps,
  getInsertOps,
  getUpdateOps,
} from "./helpers"

export default function useGlobalSync() {
  const { ws } = useWs()
  const { getToken } = useAuth()
  const {
    items: localItems,
    deletedItems,
    lastSyncItems,
    resetItems,
    setLastSyncItems,
  } = useItems()

  const syncItems = async (ws: WebSocket) => {
    const token = await getToken()
    if (!token) throw Error("Sync error: auth token not found")

    const remoteItems = await getAllItems(token)
    const insertOps = getInsertOps(remoteItems, localItems, lastSyncItems)
    const updateOps = getUpdateOps(remoteItems, localItems)
    const deleteOps = getDeleteOps(remoteItems, deletedItems)

    insertOps.forEach(op => {
      ws.send(JSON.stringify(op))
    })
    updateOps.forEach(op => {
      ws.send(JSON.stringify(op))
    })
    deleteOps.forEach(op => {
      ws.send(JSON.stringify(op))
    })

    const newItems = await getAllItems(token)
    const newUpdatedItems = addMetadata(newItems)
    resetItems(newUpdatedItems)
    setLastSyncItems(remoteItems)
  }

  useEffect(() => {
    if (ws) syncItems(ws)
  }, [ws])
}
