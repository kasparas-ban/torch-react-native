import { ReactNode, useEffect } from "react"
import { FormattedUpdateItemType } from "@/api-endpoints/endpoints/itemAPITypes"
import { BE_HOST } from "@/api-endpoints/utils/apiConfig"
import { useAuth } from "@/library/clerk"
import useItems from "@/stores/itemStore"
import useWs from "@/stores/websocketStore"
import { Platform } from "react-native"
import { ItemResponse } from "@/types/itemTypes"
import { getRandomId } from "@/utils/randomId"
import useDev from "@/components/dev/useDev"

import { handleServerMsg } from "./helpers"
import useGlobalSync from "./useGlobalSync"

const wsId = getRandomId()

export default function SyncProvider({ children }: { children: ReactNode }) {
  useGlobalSync()

  const { items, addItem, updateItem, deleteItem, setLastSyncItems } =
    useItems()

  const { isOnline } = useDev()
  const { setWs } = useWs()
  const { getToken, isSignedIn } = useAuth()

  useEffect(() => {
    if (!isOnline || !isSignedIn) {
      setLastSyncItems(items)
      console.log(
        "Device is offline or not logged in, skipping connection to ws"
      )
      return () => {
        setWs(undefined)
      }
    }

    // Establish websocket connection
    const connectWs = async () => {
      const token = await getToken()
      if (!token) throw Error("no auth token")

      initNewWs(
        token,
        (ws?: WebSocket, id?: string) => setWs(ws, id),
        (item: ItemResponse) => addItem(item, true),
        (data: Partial<ItemResponse>) =>
          updateItem(data as FormattedUpdateItemType, true),
        (item_id: string) =>
          deleteItem(
            {
              item_id,
              deleteAssociated: false,
            },
            true
          )
      )
    }

    connectWs().catch(e => console.error(e))

    return () => {
      setWs(undefined)
    }
  }, [isSignedIn && isOnline])

  return children
}

const initNewWs = (
  token: string,
  setWs: (ws?: WebSocket, id?: string) => void,
  addItem: (item: ItemResponse) => void,
  updateItem: (item: Partial<ItemResponse>) => void,
  deleteItem: (item_id: string) => void
) => {
  const ws = new WebSocket(`ws://${BE_HOST}/sync`, [token, wsId])

  ws.onopen = () => {
    console.log("WebSocket connection established:", Platform.OS, wsId)
    setWs(ws, wsId)
  }

  ws.onmessage = event => {
    handleServerMsg(
      JSON.parse(event.data),
      wsId,
      addItem,
      updateItem,
      deleteItem
    )
  }

  ws.onerror = error => {
    console.error("WebSocket error:", error)
    setWs(undefined, undefined)
  }
}
