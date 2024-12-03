import { useEffect } from "react"
import { addEventListener } from "@react-native-community/netinfo"
import { create } from "zustand"

type State = {
  isOnline?: boolean
}

type Actions = {
  setOnline: (isOnline?: boolean) => void
}

const devStore = create<State & Actions>(set => ({
  isOnline: true,
  setOnline: (isOnline?: boolean) => set(() => ({ isOnline })),
}))

const useDev = () => {
  const isOnline = devStore(state => state.isOnline)
  const setOnline = devStore(state => state.setOnline)

  useEffect(() => {
    if (__DEV__) return

    const unsub = addEventListener(state => setOnline(!!state.isConnected))
    return () => unsub()
  }, [])

  return { isOnline, setOnline }
}

export default useDev
