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

// async function syncItemData(getToken: GetToken) {
//   const rawItemData = (queryClient.getQueriesData({
//     queryKey: ["items"],
//   })?.[0]?.[1] as any)?.rawItems as SyncMetadata<ResponseItem>[] | undefined
//   if (!rawItemData) return

//   const notSyncedItems = rawItemData.filter((item) => !item.isSynced)

//   const token = await getToken()
//   if (!token) throw new Error("Token not found")

//   const changePromises = notSyncedItems.map(item => {
//     // Create new items
//     if (item.isNew) {
//       return addItem(token, JSON.parse(JSON.stringify(item)), item.type)
//     } else {
//       // Update existing items
//       return updateItem(token, JSON.parse(JSON.stringify(item)), item.type)
//     }
//   })


//   try {
//     const results = await Promise.allSettled(changePromises)
//     const updatedItems = results.map((result) => result.status === 'fulfilled' && !(result.value as ErrorResp).error ? result.value : null).filter(Boolean) as ResponseItem[]
//     const syncedItems = rawItemData.map(item => {
//       const newItemData = updatedItems.find(i => i.itemID === item.itemID)
//       return { ...newItemData, isSynced: true, updatedAt: new Date().toISOString() } ?? { ...item, isSynced: true, updatedAt: new Date().toISOString() }
//     })
//     const formattedItems = formatItemResponse(syncedItems)
//     queryClient.setQueryData(["items"], formattedItems)
//   } catch (e) {
//     console.error('Failed to sync ')
//   }
// }
