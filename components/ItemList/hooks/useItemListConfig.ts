import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { GeneralItem, ItemType } from "@/types/itemTypes"
import { createSelectors } from "@/utils/zustandUtils"

type CollapsedItemState = {
  item_id: string
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
  isFiltersOpen: boolean
  setIsFiltersOpen: (val: boolean) => void

  // Item status
  showArchivedItems: boolean
  setShowArchivedItems: (val: boolean) => void
  showCompletedItems: boolean
  setShowCompletedItems: (val: boolean) => void
}

const useItemListConfigState = create<ItemListConfigState>()(
  persist(
    (set, get) => ({
      // Collaped items
      collapsedItems: [],
      isItemCollapsed: (item: GeneralItem) =>
        !!get().collapsedItems.find(
          collapsedItem =>
            collapsedItem.item_id === item.item_id &&
            collapsedItem.itemType === item.item_type
        ),
      saveCollapseState: (item: CollapsedItemState, isCollapsed: boolean) =>
        set({
          collapsedItems: isCollapsed
            ? [...get().collapsedItems, item]
            : get().collapsedItems.filter(
                collapsedItem =>
                  !(
                    collapsedItem.item_id == item.item_id &&
                    collapsedItem.itemType == item.itemType
                  )
              ),
        }),

      // Item type header
      itemType: "GOAL",
      saveItemType: (type: ItemType) => set({ itemType: type }),
      isFiltersOpen: false,
      setIsFiltersOpen: (val: boolean) => set({ isFiltersOpen: val }),

      // Item status filter
      showArchivedItems: false,
      setShowArchivedItems: (val: boolean) => set({ showArchivedItems: val }),
      showCompletedItems: false,
      setShowCompletedItems: (val: boolean) => set({ showCompletedItems: val }),
    }),
    {
      name: "item-list-config-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

const useItemListConfig = createSelectors(useItemListConfigState)

export default useItemListConfig
