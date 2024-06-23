import { create } from "zustand"

type State = {
  ws?: WebSocket
}

type Actions = {
  setWs: (ws?: WebSocket) => void
}

const wsStore = create<State & Actions>(set => ({
  ws: undefined,
  setWs: (ws?: WebSocket) =>
    set(state => {
      if (!ws) state.ws?.close()
      return { ws }
    }),
}))

const useWs = () => ({
  ws: wsStore(state => state.ws),
  setWs: wsStore(state => state.setWs),
})

export default useWs
