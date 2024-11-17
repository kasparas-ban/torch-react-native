import { ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import NetInfo from "@react-native-community/netinfo"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { onlineManager, QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"

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
  const onCacheLoaded = async () => {
    queryClient.invalidateQueries()
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