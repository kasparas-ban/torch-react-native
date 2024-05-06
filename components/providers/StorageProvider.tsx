import { useEffect } from "react"
import { getAllItem, upsertItem } from "@/api-endpoints/endpoints/itemAPI"
import useItems, { itemStore, ItemStoreState } from "@/stores/itemStore"
import { useAuth } from "@clerk/clerk-expo"
import { GetToken } from "@clerk/types/dist"
import { ResponseItem } from "@/types/itemTypes"

import { useStorageHydration } from "../Timer/hooks/useTimerSettings"

const BE_SYNC_TIMEOUT = 5 * 1000 // 60 sec

const controller = new AbortController()
const signal = controller.signal
let requestInProgress = false

export function StorageProvider() {
  const { getToken } = useAuth()
  useStorageHydration()
  useBackendSync()

  useEffect(() => {
    const unsub = itemStore.subscribe(
      state => ({ items: state.items }),
      state => syncItems({ ...state, getToken })
    )
    return () => {
      unsub()
    }
  }, [])

  return null
}

function useBackendSync() {
  const { getToken } = useAuth()
  const { rawItems } = useItems()

  const sync = async () => {
    // End previous requests
    if (requestInProgress) {
      requestInProgress = false
      controller.abort()
    }
    requestInProgress = true

    try {
      const token = await getToken()
      if (!token) throw new Error("Failed to get auth token")
      const items = (await getAllItem(signal, token)) as ResponseItem[]

      const updatedItems = items
        .filter(item =>
          rawItems.find(
            i =>
              item.itemID === i.itemID &&
              new Date(item.updatedAt) > new Date(i.updatedAt)
          )
        )
        .map(i => ({ ...i, seenBE: true }))

      const removedItems = rawItems.filter(
        item => !items.find(i => i.itemID === item.itemID)
      )
      const addedItems = items.filter(
        item => !rawItems.find(i => i.itemID === item.itemID)
      )

      console.log("ALL ITEMS", items, updatedItems)
    } catch (e) {
      console.error(e)
    } finally {
      requestInProgress = false
    }
  }

  useEffect(() => {
    const inverval = setInterval(sync, BE_SYNC_TIMEOUT)
    return () => clearInterval(inverval)
  }, [])
}

async function syncItems({
  items,
  getToken,
}: ItemStoreState & { getToken: GetToken }) {
  const updatedItems = items.filter(item => !item.isSynced)

  const token = await getToken()
  if (!token) return

  const updatePromises = updatedItems.map(item => {
    return upsertItem(token, item)
  })

  try {
    await Promise.allSettled(updatePromises)
  } catch (e) {
    console.error(e)
  }
}
