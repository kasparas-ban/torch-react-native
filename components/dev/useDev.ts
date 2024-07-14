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

const useDev = () => ({
  isOnline: devStore(state => state.isOnline),
  setOnline: devStore(state => state.setOnline),
})

export default useDev
