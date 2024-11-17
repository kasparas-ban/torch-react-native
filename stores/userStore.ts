import useUserSync from "@/providers/SyncProvider/useUserSync"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { ProfileResp } from "@/types/userTypes"

type State = {
  user?: ProfileResp
  elapsedTime: number // Elapsed time since last sync
}

type Actions = {
  setUser: (user?: ProfileResp) => void
  updateUser: (user: Partial<ProfileResp>) => void
  updateUserTime: (time_spent: number) => void
  resetElapsedTime: () => void
}

const userStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      user: undefined,
      elapsedTime: 0,
      setUser: (user?: ProfileResp) => set(() => ({ elapsedTime: 0, user })),
      updateUser: (user: Partial<ProfileResp>) =>
        set(state => {
          if (!state.user) return state

          return { user: { ...state.user, ...user }, elapsedTime: 0 }
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
      resetElapsedTime: () => set(() => ({ elapsedTime: 0 })),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

const useUserInfo = () => {
  const store = {
    user: userStore(state => state.user),
    elapsedTime: userStore(state => state.elapsedTime),
    setUser: userStore(state => state.setUser),
    updateUser: userStore(state => state.updateUser),
    updateUserTime: userStore(state => state.updateUserTime),
    resetElapsedTime: userStore(state => state.resetElapsedTime),
  }

  const op = useUserSync()

  return {
    user: store.user,
    elapsedTime: store.elapsedTime,
    setUser: store.setUser,
    updateUser: (data: Partial<ProfileResp>, local: boolean = false) => {
      const currentUser = userStore.getState().user
      if (!currentUser) return
      const newUser = { ...currentUser, ...data }
      store.setUser(newUser)
      if (!local) op.updateUser(newUser)
    },
    updateUserTime: (time: number, local: boolean = false) => {
      const currentUser = userStore.getState().user
      if (!currentUser) return

      if (local) {
        store.updateUserTime(time)
      } else {
        const newUser = {
          ...currentUser,
          focus_time: currentUser.focus_time + time,
        }
        op.updateUser(newUser)
      }
    },
    resetElapsedTime: store.resetElapsedTime,
  }
}

export default useUserInfo
