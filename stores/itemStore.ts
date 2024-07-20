import {
  DeleteItemData,
  DeleteItemReq,
  FormattedUpdateItemType,
  UpdateItemProgressReq,
  UpdateItemStatusReq,
} from "@/api-endpoints/endpoints/itemAPITypes"
import { formatItemResponse } from "@/api-endpoints/utils/responseFormatters"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { ItemResponse, ItemStatus } from "@/types/itemTypes"
import { removeElsFromArray } from "@/utils/utils"
import useItemsSync from "@/components/providers/SyncProvider/useItemsSync"

import { getAllAssociatedItems } from "./helpers"

type State = {
  items: ItemResponse[]
  lastSyncItems: ItemResponse[]
  deletedItems: DeleteItemData[]
  updatedItems: string[]
}

type Actions = {
  setLastSyncItems: (items: ItemResponse[]) => void
  resetItems: (items: ItemResponse[]) => void
  addItem: (item: ItemResponse) => void
  updateItem: (updatedItem: ItemResponse) => void
  deleteItems: (items: { item_id: string; cl: number }[]) => void
  updateItemProgress: (req: UpdateItemProgressReq) => void
  updateItemStatus: (itemIds: string[], status: ItemStatus) => void
}

const itemStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      items: [],
      lastSyncItems: [],
      deletedItems: [],
      updatedItems: [],
      resetItems: (items: ItemResponse[]) =>
        set(() => ({ items, deletedItems: [], updatedItems: [] })),
      addItem: (newItem: ItemResponse) =>
        set(state => ({ items: [...state.items, newItem] })),
      updateItem: (updatedItem: ItemResponse) =>
        set(state => ({
          items: state.items.map(i =>
            i.item_id === updatedItem.item_id ? updatedItem : i
          ),
          updatedItems: Array.from(
            new Set([...state.updatedItems, updatedItem.item_id])
          ),
        })),
      deleteItems: (items: DeleteItemData[]) =>
        set(state => ({
          items: state.items.filter(
            i => !items.find(it => i.item_id === it.item_id)
          ),
          deletedItems: [...state.deletedItems, ...items],
          updatedItems: removeElsFromArray(
            state.updatedItems,
            items.map(i => i.item_id)
          ),
        })),
      setLastSyncItems: (items: ItemResponse[]) =>
        set(() => ({ lastSyncItems: items })),
      updateItemProgress: (req: UpdateItemProgressReq) =>
        set(state => ({
          items: state.items.map(i =>
            i.item_id === req.item_id
              ? { ...i, time_spent: i.time_spent + req.time_spent }
              : i
          ),
        })),
      updateItemStatus: (itemIds: string[], status: ItemStatus) =>
        set(state => ({
          items: state.items.map(item =>
            itemIds.find(id => id === item.item_id) ? { ...item, status } : item
          ),
        })),
    }),
    {
      name: "items-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

const getFormattedItems = (state: State) => formatItemResponse(state.items)

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
    updatedItems: itemStore(state => state.updatedItems),
    // Actions
    addItem: (item: ItemResponse, local: boolean = false) => {
      store.addItem(item)
      if (!local) op.addItem(item)
    },
    updateItem: (
      updatedData: FormattedUpdateItemType,
      local: boolean = false
    ) => {
      const oldItem = itemStore
        .getState()
        .items.find(i => i.item_id === updatedData.item_id)
      if (!oldItem) return

      const newItem: ItemResponse = {
        ...oldItem,
        ...updatedData,
      }

      store.updateItem(newItem)
      if (!local) op.updateItem(oldItem, newItem)
    },
    deleteItem: (data: DeleteItemReq, local: boolean = false) => {
      const allItems = itemStore.getState().items
      const itemToDelete = allItems.find(i => i.item_id === data.item_id)
      if (!itemToDelete) return

      if (data.deleteAssociated) {
        // Delete all associated items
        const associatedItems = getAllAssociatedItems(allItems, itemToDelete)
        const itemsToDelete = associatedItems.map(i => ({
          item_id: i.item_id,
          cl: i.item__c,
        }))
        store.deleteItems(itemsToDelete)
        if (!local) itemsToDelete.forEach(data => op.deleteItem(data))
        return
      }

      const deleteData = {
        item_id: itemToDelete.item_id,
        cl: itemToDelete.item__c,
      }

      store.deleteItems([deleteData])
      if (!local) op.deleteItem(deleteData)
    },
    resetItems: itemStore(state => state.resetItems),
    setLastSyncItems: itemStore(state => state.setLastSyncItems),
    updateItemProgress: itemStore(state => state.updateItemProgress),
    updateItemStatus: (req: UpdateItemStatusReq, local: boolean = false) => {
      const allItems = itemStore.getState().items
      const updateItem = allItems.find(i => i.item_id === req.item_id)
      if (!updateItem) return

      if (req.updateAssociated) {
        const associatedItems = getAllAssociatedItems(allItems, updateItem)
        associatedItems.forEach(item =>
          store.updateItem({ ...item, status: req.status })
        )
        if (!local)
          associatedItems.forEach(item =>
            op.updateItem(updateItem, { ...item, status: req.status })
          )
        return
      }

      store.updateItem({ ...updateItem, status: req.status })
      if (!local)
        op.updateItem(updateItem, { ...updateItem, status: req.status })
    },
  }
}

export default useItems
