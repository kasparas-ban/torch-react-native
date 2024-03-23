import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { GeneralItem, ItemType } from "@/types/itemTypes"

type CollapsedItemState = {
  itemId: string
  itemType: ItemType
}

interface ItemListConfigState {
  // Collaped items
  collapsedItems: CollapsedItemState[]
  isItemCollapsed: (item: GeneralItem) => boolean
  saveCollapseState: (item: CollapsedItemState, isCollapsed: boolean) => void

  // Item type header
  itemType: ItemType
  saveItemType: (type: ItemType) => void

  // Item status
  showArchivedItems: boolean
  setShowArchivedItems: (val: boolean) => void
  showCompletedItems: boolean
  setShowCompletedItems: (val: boolean) => void
}

const useItemListConfig = create<ItemListConfigState>()(
  persist(
    (set, get) => ({
      // Collaped items
      collapsedItems: [],
      isItemCollapsed: (item: GeneralItem) =>
        !!get().collapsedItems.find(
          collapsedItem =>
            collapsedItem.itemId === item.itemID &&
            collapsedItem.itemType === item.type
        ),
      saveCollapseState: (item: CollapsedItemState, isCollapsed: boolean) =>
        set({
          collapsedItems: isCollapsed
            ? [...get().collapsedItems, item]
            : get().collapsedItems.filter(
                collapsedItem =>
                  !(
                    collapsedItem.itemId == item.itemId &&
                    collapsedItem.itemType == item.itemType
                  )
              ),
        }),

      // Item type header
      itemType: "GOAL",
      saveItemType: (type: ItemType) => set({ itemType: type }),

      // Item status filter
      showArchivedItems: false,
      setShowArchivedItems: (val: boolean) => set({ showArchivedItems: val }),
      showCompletedItems: false,
      setShowCompletedItems: (val: boolean) => set({ showCompletedItems: val }),
    }),
    {
      name: "item-list-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export default useItemListConfig
