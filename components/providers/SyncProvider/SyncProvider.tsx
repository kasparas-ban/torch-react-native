import { ReactNode, useEffect } from "react"
import { BE_HOST } from "@/api-endpoints/utils/apiConfig"
import useWs from "@/stores/websocketStore"
import { useAuth } from "@clerk/clerk-expo"

import useGlobalSync from "./useGlobalSync"

export default function SyncProvider({ children }: { children: ReactNode }) {
  useGlobalSync()

  const { setWs } = useWs()
  const { getToken } = useAuth()

  useEffect(() => {
    // Establish websocket connection
    const connectWs = async () => {
      const token = await getToken()
      if (!token) throw Error("no auth token")
      initNewWs(token, (ws?: WebSocket) => setWs(ws))
    }

    connectWs().catch(e => console.error(e))

    return () => {
      setWs(undefined)
    }
  }, [])

  return children
}

const initNewWs = (token: string, setWs: (ws?: WebSocket) => void) => {
  const ws = new WebSocket(`ws://${BE_HOST}/sync`, [token])

  ws.onopen = event => {
    console.log("WebSocket connection established:", event)
    setWs(ws)
  }

  ws.onmessage = event => {
    // TODO: handle messages from server
    console.log("Message from server:", event.data)
  }

  ws.onerror = error => {
    console.error("WebSocket error:", error)
    setWs(undefined)
  }
}
