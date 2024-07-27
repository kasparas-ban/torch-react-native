import { create } from "zustand"

type State = {
  ws?: WebSocket
  id?: string
}

type Actions = {
  setWs: (ws?: WebSocket, id?: string) => void
}

export const wsStore = create<State & Actions>(set => ({
  ws: undefined,
  id: undefined,
  setWs: (ws?: WebSocket, id?: string) =>
    set(state => {
      if (state.ws || !ws) state.ws?.close()
      return { ws, id }
    }),
}))

const useWs = () => ({
  ws: wsStore(state => state.ws),
  id: wsStore(state => state.id),
  setWs: wsStore(state => state.setWs),
})

export default useWs
