import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { SyncMetadata } from "@/types/generalTypes"
import { ProfileResp, UpdateProfileReq } from "@/types/userTypes"

type State = {
  user?: SyncMetadata<ProfileResp>
}

type Actions = {
  setUser: (user: ProfileResp) => void
  updateUser: (user: UpdateProfileReq) => void
  updateUserTime: (timeSpent: number) => void
}

const itemStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      user: undefined,
      setUser: (user: ProfileResp) =>
        set(() => ({
          user: {
            ...user,
            updatedAt: new Date().toISOString(),
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
              updatedAt: new Date().toISOString(),
              isSynced: false,
            },
          }
        }),
      updateUserTime: (timeSpent: number) =>
        set(state => {
          if (!state.user) return state

          return {
            user: {
              ...state.user,
              focusTime: state.user?.focusTime + timeSpent,
              updatedAt: new Date().toISOString(),
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
