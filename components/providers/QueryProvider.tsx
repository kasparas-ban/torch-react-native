import { ReactNode } from "react"
import { updateUser } from "@/api-endpoints/endpoints/userAPI"
import { useAuth } from "@clerk/clerk-expo"
import { GetToken } from "@clerk/types/dist"
import AsyncStorage from "@react-native-async-storage/async-storage"
import NetInfo from "@react-native-community/netinfo"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { onlineManager, QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { SyncMetadata } from "@/types/generalTypes"
import { ProfileResp, UpdateProfileReq } from "@/types/userTypes"
import { ResponseItem } from "@/types/itemTypes"
import { addItem, updateItem } from "@/api-endpoints/endpoints/itemAPI"
import { ErrorResp } from "@/api-endpoints/utils/errorMsgs"
import { formatItemResponse } from "@/api-endpoints/utils/responseFormatters"

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected)
  })
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
})

export default function QueryProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth()

  const onCacheLoaded = async () => {
    // Mark all queries as in need of refetching
    queryClient.invalidateQueries()

    // Skip data sync when offline
    if (!onlineManager.isOnline()) return

    // Sync data
    // syncUserData(getToken)
    // syncItemData(getToken)
  }

  return (
    <PersistQueryClientProvider
      onSuccess={onCacheLoaded}
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}

// async function syncUserData(getToken: GetToken) {
//   const userData = queryClient.getQueriesData({
//     queryKey: ["user"],
//   })?.[0]?.[1] as SyncMetadata<ProfileResp> | undefined
//   if (!userData) return

//   if (!userData.isSynced) {
//     const token = await getToken()
//     if (!token) throw new Error("Token not found")

//     const latestUserData: UpdateProfileReq = {
//       username: userData.username,
//       birthday: userData.birthday,
//       gender: userData.gender,
//       countryCode: userData.countryCode,
//       city: userData.city,
//       description: userData.description,
//     }

//     try {
//       const updatedUser = await updateUser(token, latestUserData)
//       queryClient.setQueryData(["user"], updatedUser)
//     } catch (e) {
//       console.error("User data sync failed:", e)
//     }
//   }
// }