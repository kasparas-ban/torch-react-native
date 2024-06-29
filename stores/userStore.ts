import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { ProfileResp, UpdateProfileReq } from "@/types/userTypes"

type State = {
  user?: ProfileResp
}

type Actions = {
  setUser: (user: ProfileResp) => void
  updateUser: (user: UpdateProfileReq) => void
  updateUserTime: (time_spent: number) => void
}

const itemStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      user: undefined,
      setUser: (user: ProfileResp) =>
        set(() => ({
          user: {
            ...user,
            updated_at: new Date().toISOString(),
            isSynced: false,
          },
        })),
      updateUser: (user: UpdateProfileReq) =>
        set(state => {
          if (!state.user) return state

          return {
            user: {
              ...state.user,
              ...user,
              updated_at: new Date().toISOString(),
              isSynced: false,
            },
          }
        }),
      updateUserTime: (time_spent: number) =>
        set(state => {
          if (!state.user) return state

          return {
            user: {
              ...state.user,
              focusTime: state.user?.focusTime + time_spent,
              updated_at: new Date().toISOString(),
              isSynced: false,
            },
          }
        }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

const useUserInfo = () => ({
  user: itemStore(state => state.user),
  setUser: itemStore(state => state.setUser),
  updateUser: itemStore(state => state.updateUser),
  updateUserTime: itemStore(state => state.updateUserTime),
})

export default useUserInfo
