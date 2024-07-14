import { useEffect } from "react"
import { getAllItems } from "@/api-endpoints/endpoints/itemsAPI"
import { useAuth } from "@/library/clerk"
import useItems from "@/stores/itemStore"
import useWs from "@/stores/websocketStore"
import useDev from "@/components/dev/useDev"

import { getDeleteOps, getInsertOps, getUpdateOps } from "./helpers"

export default function useGlobalSync() {
  const { isOnline } = useDev()
  const { ws } = useWs()
  const { getToken } = useAuth()

  const {
    items: localItems,
    deletedItems,
    updatedItems,
    lastSyncItems,
    resetItems,
    setLastSyncItems,
  } = useItems()

  const syncItems = async (ws: WebSocket) => {
    const token = await getToken()
    if (!token) throw Error("Sync error: auth token not found")
    if (!isOnline) {
      throw Error("Device if offline, skipping sync")
    }

    const remoteItems = await getAllItems(token)
    const insertOps = getInsertOps(remoteItems, localItems, lastSyncItems)
    const updateOps = getUpdateOps(updatedItems, remoteItems, localItems)
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
    resetItems(newItems)
    setLastSyncItems(remoteItems)
  }

  useEffect(() => {
    if (ws) syncItems(ws)
  }, [ws])
}
