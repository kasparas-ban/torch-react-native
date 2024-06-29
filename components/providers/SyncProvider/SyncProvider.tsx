import { ReactNode, useEffect } from "react"
import { BE_HOST } from "@/api-endpoints/utils/apiConfig"
import useItems from "@/stores/itemStore"
import useWs from "@/stores/websocketStore"
import { useAuth } from "@clerk/clerk-expo"
import { ItemResponse, SyncMetadata } from "@/types/itemTypes"
import { getRandomId } from "@/utils/randomId"

import { handleServerMsg } from "./helpers"
import useGlobalSync from "./useGlobalSync"

export default function SyncProvider({ children }: { children: ReactNode }) {
  useGlobalSync()

  const { addItem, updateItem, deleteItem } = useItems()

  const { setWs } = useWs()
  const { getToken, isSignedIn } = useAuth()

  useEffect(() => {
    // Establish websocket connection
    const connectWs = async () => {
      const token = await getToken()
      if (!token) throw Error("no auth token")
      initNewWs(
        token,
        (ws?: WebSocket, id?: string) => setWs(ws, id),
        (item: SyncMetadata<ItemResponse>) => addItem(item, true),
        (data: Partial<ItemResponse>) => updateItem({ data }, true),
        (item_id: string) =>
          deleteItem(
            {
              item_id,
              deleteAssociated: false,
              cl: Infinity, // Fix this
            },
            true
          )
      )
    }

    connectWs().catch(e => console.error(e))

    return () => {
      setWs(undefined)
    }
  }, [isSignedIn])

  return children
}

const initNewWs = (
  token: string,
  setWs: (ws?: WebSocket, id?: string) => void,
  addItem: (item: SyncMetadata<ItemResponse>) => void,
  updateItem: (data: Partial<ItemResponse>) => void,
  deleteItem: (item_id: string) => void
) => {
  const wsId = getRandomId()
  const ws = new WebSocket(`ws://${BE_HOST}/sync`, [token, wsId])

  ws.onopen = event => {
    console.log("WebSocket connection established:", event)
    setWs(ws, wsId)
  }

  ws.onmessage = event => {
    handleServerMsg(JSON.parse(event.data), addItem, updateItem, deleteItem)
  }

  ws.onerror = error => {
    console.error("WebSocket error:", error)
    setWs(undefined, undefined)
  }
}
