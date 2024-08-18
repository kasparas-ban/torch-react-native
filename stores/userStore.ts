import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { ProfileResp } from "@/types/userTypes"
import useUserSync from "@/components/providers/SyncProvider/useUserSync"

type State = {
  user?: ProfileResp
  elapsedTime: number // Elapsed time since last sync
}

type Actions = {
  setUser: (user: ProfileResp) => void
  updateUser: (user: Partial<ProfileResp>) => void
  updateUserTime: (time_spent: number) => void
}

const itemStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      user: undefined,
      elapsedTime: 0,
      setUser: (user: ProfileResp) => set(() => ({ user })),
      updateUser: (user: Partial<ProfileResp>, local: boolean = false) =>
        set(state => {
          if (!state.user) return state

          return { user: { ...state.user, ...user } }
        }),
      updateUserTime: (time_spent: number) =>
        set(state => {
          if (!state.user) return state

          return {
            user: {
              ...state.user,
              focusTime: state.user.focus_time + time_spent,
            },
            elapsedTime: state.elapsedTime + time_spent,
          }
        }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

const useUserInfo = () => {
  const store = {
    user: itemStore(state => state.user),
    elapsedTime: itemStore(state => state.elapsedTime),
    setUser: itemStore(state => state.setUser),
    updateUser: itemStore(state => state.updateUser),
    updateUserTime: itemStore(state => state.updateUserTime),
  }

  const op = useUserSync()

  return {
    user: store.user,
    elapsedTime: store.elapsedTime,
    setUser: store.setUser,
    updateUser: (data: Partial<ProfileResp>, local: boolean = false) => {
      if (!store.user) return
      const newUser = { ...store.user, ...data }
      store.setUser(newUser)
      if (!local) op.updateUser(newUser)
    },
    updateUserTime: (time: number, local: boolean = false) => {
      if (!store.user) return

      if (local) {
        store.updateUserTime(time)
      } else {
        const newUser = {
          ...store.user,
          focus_time: store.user.focus_time + time,
        }
        op.updateUser(newUser)
      }
    },
  }
}

export default useUserInfo
