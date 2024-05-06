import {
  DeleteItemReq,
  NewItemType,
  UpdateItemProgressReq,
  UpdateItemStatusReq,
  UpdateItemType,
} from "@/api-endpoints/endpoints/itemAPI"
import { formatItemResponse } from "@/api-endpoints/utils/responseFormatters"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { memoize } from "proxy-memoize"
import { create } from "zustand"
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware"
import { Stringified, SyncMetadata } from "@/types/generalTypes"
import { ItemType, ResponseItem } from "@/types/itemTypes"
import { getRandomId } from "@/utils/randomId"
import { formatDate } from "@/utils/utils"
import {
  NewTaskType,
  UpdateTaskType,
} from "@/components/itemModal/itemForms/schemas"

export type ItemStoreState = {
  items: SyncMetadata<ResponseItem>[]
  lastSync: Date | null
  updatedAt: Date
}

type ItemStoreActions = {
  setItems: (items: ResponseItem[]) => void
  addItem: (item: NewItemType, type: ItemType) => void
  updateItem: (item: UpdateItemType, type: ItemType) => void
  updateItemProgress: (req: UpdateItemProgressReq) => void
  updateItemStatus: (req: UpdateItemStatusReq) => void
  deleteItem: (req: DeleteItemReq) => void
}

export const itemStore = create<ItemStoreState & ItemStoreActions>()(
  persist(
    subscribeWithSelector((set, get) => ({
      items: [],
      lastSync: null,
      updatedAt: new Date(),
      setItems: (items: ResponseItem[]) =>
        set(() => ({
          items: items.map(i => ({
            ...i,
            updatedAt: formatDate(new Date()),
          })),
          updatedAt: new Date(),
        })),
      addItem: (item: NewItemType, type: ItemType) =>
        set(state => {
          const newItem = {
            // New item data
            ...(item as Stringified<NewItemType>),
            type,
            itemID: getRandomId(),
            ...((item as NewTaskType).recurring
              ? {
                  ...(item as NewTaskType).recurring,
                  progress: 0,
                }
              : null),
            timeSpent: 0,
            status: "ACTIVE",
            createdAt: formatDate(new Date()),
            // Sync data
            updatedAt: formatDate(new Date()),
          } as SyncMetadata<ResponseItem>

          return { items: [...state.items, newItem], updatedAt: new Date() }
        }),
      updateItem: (item: UpdateItemType) =>
        set(state => {
          const updatedItem = {
            ...item,
            updatedAt: formatDate(new Date()),
          } as Stringified<SyncMetadata<UpdateItemType>>

          const updatedItems = state.items.map(oldItem =>
            oldItem.itemID === updatedItem.itemID
              ? {
                  ...oldItem,
                  ...updatedItem,
                  recurring: (updatedItem as UpdateTaskType).recurring
                    ? {
                        ...(updatedItem as Stringified<UpdateTaskType>)
                          ?.recurring,
                        progress: oldItem?.recurring?.progress || 0,
                      }
                    : null,
                }
              : oldItem
          ) as SyncMetadata<ResponseItem>[]

          return { items: updatedItems, updatedAt: new Date() }
        }),
      updateItemProgress: (req: UpdateItemProgressReq) =>
        set(state => ({
          items: state.items.map(item =>
            item.itemID === req.itemID
              ? {
                  ...item,
                  timeSpent: item.timeSpent + req.timeSpent,
                  updatedAt: formatDate(new Date()),
                }
              : item
          ),
        })),
      updateItemStatus: (req: UpdateItemStatusReq) =>
        set(state => {
          let updateItemIDs = [req.itemID]

          if (req.updateAssociated) {
            if (req.itemType === "GOAL") {
              const associatedTasks = state.items
                .filter(i => i.type === "TASK" && i.parentID === req.itemID)
                .map(task => task.itemID)

              updateItemIDs.push(...associatedTasks)
            }
            if (req.itemType === "DREAM") {
              const associatedGoals = state.items
                .filter(
                  goal => goal.type === "TASK" && goal.parentID === req.itemID
                )
                .map(i => i.itemID)
              const associatedTasks = state.items
                .filter(task =>
                  associatedGoals.find(goalID => goalID === task.parentID)
                )
                .map(i => i.itemID)

              updateItemIDs.push(...associatedGoals, ...associatedTasks)
            }
          }

          const newItems = state.items.map(item =>
            updateItemIDs.includes(item.itemID)
              ? {
                  ...item,
                  status: req.status,
                  updatedAt: formatDate(new Date()),
                }
              : item
          )

          return { items: newItems }
        }),
      deleteItem: (req: DeleteItemReq) =>
        set(state => {
          let deletedItemIDs = [req.itemID]

          if (req.deleteAssociated) {
            if (req.itemType === "GOAL") {
              const associatedTasks = state.items
                .filter(i => i.type === "TASK" && i.parentID === req.itemID)
                .map(task => task.itemID)

              deletedItemIDs.push(...associatedTasks)
            }
            if (req.itemType === "DREAM") {
              const associatedGoals = state.items
                .filter(
                  goal => goal.type === "TASK" && goal.parentID === req.itemID
                )
                .map(task => task.itemID)

              const associatedTasks = state.items
                .filter(task =>
                  associatedGoals.find(goalID => goalID === task.parentID)
                )
                .map(task => task.itemID)

              deletedItemIDs.push(...associatedGoals, ...associatedTasks)
            }
          }

          return {
            items: state.items.filter(
              item => !deletedItemIDs.find(id => id === item.itemID)
            ),
          }
        }),
    })),
    {
      name: "items-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

const getFormattedItems = memoize((state: ItemStoreState) =>
  formatItemResponse(state.items)
)

const useItems = () => {
  const allItems = itemStore(getFormattedItems)

  return {
    ...allItems,
    allItems,
    setItems: itemStore(state => state.setItems),
    addItem: itemStore(state => state.addItem),
    updateItem: itemStore(state => state.updateItem),
    updateItemProgress: itemStore(state => state.updateItemProgress),
    updateItemStatus: itemStore(state => state.updateItemStatus),
  }
}

export default useItems
