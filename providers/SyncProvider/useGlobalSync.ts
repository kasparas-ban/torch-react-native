import { useEffect } from "react"
import useDev from "@/devTools/useDev"
import useItems from "@/stores/itemStore"
import useUserInfo from "@/stores/userStore"
import useWs from "@/stores/websocketStore"
import { useAuth } from "@/lib/clerk"
import { getAllItems } from "@/api/endpoints/itemsAPI"
import { getUserInfo } from "@/api/endpoints/userAPI"

import {
  getDeleteOps,
  getInsertOps,
  getUpdateOps,
  getUserUpdateOp,
} from "./helpers"

export default function useGlobalSync() {
  const { isOnline } = useDev()
  const { ws } = useWs()
  const { getToken, signOut } = useAuth()

  const {
    items: localItems,
    deletedItems,
    updatedItems,
    elapsedTime,
    lastSyncItems,
    resetItems,
    setLastSyncItems,
  } = useItems()

  const {
    user: currentUser,
    elapsedTime: elapsedUserTime,
    setUser,
    resetElapsedTime,
  } = useUserInfo()

  const syncItems = async (ws: WebSocket) => {
    const token = await getToken()
    if (!token) throw Error("Sync error: auth token not found")
    if (!isOnline) {
      throw Error("Device if offline, skipping sync")
    }

    const remoteItems = await getAllItems(token)
    const insertOps = getInsertOps(remoteItems, localItems, lastSyncItems)
    const updateOps = getUpdateOps(
      updatedItems,
      elapsedTime,
      remoteItems,
      localItems
    )
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

  const syncUser = async (ws: WebSocket) => {
    const token = await getToken()
    if (!token) throw Error("Sync error: auth token not found")
    if (!isOnline) {
      throw Error("Device if offline, skipping sync")
    }

    const user = await getUserInfo(token)
    if (!user) {
      await signOut()
      resetElapsedTime()
      return
    }

    if (!currentUser) {
      setUser(user)
      resetElapsedTime()
      return
    }

    const updateOp = getUserUpdateOp(currentUser, user, elapsedUserTime)
    if (updateOp) {
      ws.send(JSON.stringify(updateOp))
    }

    setUser(user)
    resetElapsedTime()
  }

  useEffect(() => {
    if (ws) {
      syncItems(ws)
      syncUser(ws)
    }
  }, [ws])
}
