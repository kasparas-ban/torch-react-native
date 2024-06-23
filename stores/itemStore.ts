import {
  DeleteItemData,
  DeleteItemReq,
  FormattedUpdateItemType,
  UpdateItemProgressReq,
  UpdateItemStatusReq,
} from "@/api-endpoints/endpoints/itemAPITypes"
import { formatItemResponse } from "@/api-endpoints/utils/responseFormatters"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { memoize } from "proxy-memoize"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { ItemResponse, SyncMetadata, UpdatedFields } from "@/types/itemTypes"
import { getDefaultMetadata } from "@/components/providers/SyncProvider/helpers"
import useItemsSync from "@/components/providers/SyncProvider/useItemsSync"

import { getAllAssociatedItems } from "./helpers"

type State = {
  items: SyncMetadata<ItemResponse>[]
  lastSyncItems: ItemResponse[]
  deletedItems: DeleteItemData[]
}

type Actions = {
  setLastSyncItems: (items: ItemResponse[]) => void
  resetItems: (items: SyncMetadata<ItemResponse>[]) => void
  addItem: (item: SyncMetadata<ItemResponse>) => void
  updateItem: (updatedItem: SyncMetadata<ItemResponse>) => void
  deleteItems: (items: { item_id: string; cl: number }[]) => void
  // updateItemProgress: (req: UpdateItemProgressReq) => void
  // updateItemStatus: (req: UpdateItemStatusReq) => void
}

const itemStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      items: [],
      lastSyncItems: [],
      deletedItems: [],
      resetItems: (items: SyncMetadata<ItemResponse>[]) =>
        set(() => ({ items, deletedItems: [] })),
      addItem: (newItem: SyncMetadata<ItemResponse>) =>
        set(state => ({ items: [...state.items, newItem] })),
      updateItem: (updatedItem: SyncMetadata<ItemResponse>) =>
        set(state => ({
          items: state.items.map(i =>
            i.item_id === updatedItem.item_id ? updatedItem : i
          ),
        })),
      deleteItems: (items: DeleteItemData[]) =>
        set(state => ({
          items: state.items.filter(
            i => !items.find(it => i.item_id === it.item_id)
          ),
          deletedItems: [...state.deletedItems, ...items],
        })),
      setLastSyncItems: (items: ItemResponse[]) =>
        set(() => ({ lastSyncItems: items })),
    }),
    {
      name: "items-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

const getFormattedItems = memoize((state: State) =>
  formatItemResponse(state.items)
)

const useItems = () => {
  const store = {
    addItem: itemStore(state => state.addItem),
    updateItem: itemStore(state => state.updateItem),
    deleteItems: itemStore(state => state.deleteItems),
  }
  const allItems = itemStore(getFormattedItems)
  const op = useItemsSync()

  return {
    // State
    ...allItems,
    allItems,
    lastSyncItems: itemStore(state => state.lastSyncItems),
    items: itemStore(state => state.items),
    deletedItems: itemStore(state => state.deletedItems),
    // Actions
    addItem: (item: SyncMetadata<ItemResponse>) => {
      store.addItem(item)
      op.addItem(item)
    },
    updateItem: (updatedData: FormattedUpdateItemType) => {
      const oldItem = allItems.rawItems.find(
        i => i.item_id === updatedData.item_id
      )
      if (!oldItem) return

      const updatedFields = oldItem
        ? Object.entries(oldItem.updatedFields).reduce((prev, curr) => {
            const field = curr[0] as keyof UpdatedFields
            const updatedField = (updatedData as any)[field]
            const isUpdated = updatedField && updatedField !== oldItem[field]
            return { ...prev, [field]: isUpdated || curr[1] }
          }, oldItem.updatedFields)
        : getDefaultMetadata()

      const newItem: SyncMetadata<ItemResponse> = {
        ...oldItem,
        ...updatedData,
        updatedFields,
      }

      store.updateItem(newItem)
      op.updateItem(newItem)
    },
    deleteItem: (data: DeleteItemReq) => {
      if (data.deleteAssociated) {
        // Delete all associated items
        const associatedItems = getAllAssociatedItems(allItems.rawItems, data)
        store.deleteItems(associatedItems)
        associatedItems.forEach(data => op.deleteItem(data))
        return
      }

      store.deleteItems([data])
      op.deleteItem(data)
    },
    resetItems: itemStore(state => state.resetItems),
    setLastSyncItems: itemStore(state => state.setLastSyncItems),
    updateItemProgress: (req: UpdateItemProgressReq) => {
      console.log("NEED TO IMPLEMENT")
    },
    updateItemStatus: (req: UpdateItemStatusReq) => {
      console.log("NEED TO IMPLEMENT")
    },
  }
}

export default useItems
