import { ReactNode, useEffect } from "react"
import useDev from "@/devTools/useDev"
import useItems from "@/stores/itemStore"
import useUserInfo from "@/stores/userStore"
import useWs from "@/stores/websocketStore"
import { Platform } from "react-native"
import { ItemResponse } from "@/types/itemTypes"
import { ProfileResp } from "@/types/userTypes"
import { useAuth } from "@/lib/clerk"
import { FormattedUpdateItemType } from "@/api/endpoints/itemAPITypes"
import { BE_HOST } from "@/api/utils/apiConfig"
import { getRandomId } from "@/utils/randomId"

import { handleServerMsg } from "./helpers"
import useGlobalSync from "./useGlobalSync"

const wsId = getRandomId()

export default function SyncProvider({ children }: { children: ReactNode }) {
  useGlobalSync()

  const { items, addItem, updateItem, deleteItem, setLastSyncItems } =
    useItems()

  const { updateUser } = useUserInfo()

  const { isOnline } = useDev()
  const { ws, setWs } = useWs()
  const { getToken, isSignedIn } = useAuth()

  const connectWs = async () => {
    const token = await getToken()
    if (!token) throw Error("no auth token")

    initNewWs(
      token,
      (ws?: WebSocket, id?: string) => setWs(ws, id),
      (data: Partial<ProfileResp>) => updateUser(data, true),
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

  // Enable periodic checks for WS connections
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!ws && isOnline && isSignedIn) {
        connectWs().catch(e => console.error(e))
      }
    }, 5000)

    return () => {
      clearInterval(intervalId)
    }
  }, [!ws && isOnline && isSignedIn])

  // WS setup on app launch
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
  updateUser: (user: Partial<ProfileResp>) => void,
  addItem: (item: ItemResponse) => void,
  updateItem: (item: Partial<ItemResponse>) => void,
  deleteItem: (item_id: string) => void
) => {
  const ws = new WebSocket(
    `${process.env.EXPO_PUBLIC_WS_PROTOCOL}://${BE_HOST}/sync`,
    [token, wsId]
  )

  ws.onopen = () => {
    console.log("WebSocket connection established:", Platform.OS, wsId)
    setWs(ws, wsId)
  }

  ws.onmessage = event => {
    handleServerMsg(
      JSON.parse(event.data),
      wsId,
      updateUser,
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
