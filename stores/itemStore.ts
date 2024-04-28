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
import { createJSONStorage, persist } from "zustand/middleware"
import { Stringified, SyncMetadata } from "@/types/generalTypes"
import { ItemType, ResponseItem } from "@/types/itemTypes"
import { getRandomId } from "@/utils/randomId"
import {
  NewTaskType,
  UpdateTaskType,
} from "@/components/itemModal/itemForms/schemas"

type State = {
  items: SyncMetadata<ResponseItem>[]
  deletedItemIDs: string[]
}

type Actions = {
  setItems: (items: ResponseItem[]) => void
  addItem: (item: NewItemType, type: ItemType) => void
  updateItem: (item: UpdateItemType, type: ItemType) => void
  updateItemProgress: (req: UpdateItemProgressReq) => void
  updateItemStatus: (req: UpdateItemStatusReq) => void
  deleteItem: (req: DeleteItemReq) => void
}

const itemStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      items: [],
      deletedItemIDs: [],
      setItems: (items: ResponseItem[]) =>
        set(() => ({
          items: items.map(i => ({
            ...i,
            updatedAt: new Date().toISOString(),
            isSynced: false,
          })),
        })),
      addItem: (item: NewItemType, type: ItemType) =>
        set(state => {
          const newItem = {
            // New item data
            ...(item as Stringified<NewItemType>),
            type,
            itemID: getRandomId(),
            ...((item as NewTaskType).recurring ?? {
              ...(item as NewTaskType).recurring,
              progress: 0,
            }),
            timeSpent: 0,
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            // Sync data
            updatedAt: new Date().toISOString(),
            isSynced: false,
            isNew: true,
          } as SyncMetadata<ResponseItem>

          return { items: [...state.items, newItem] }
        }),
      updateItem: (item: UpdateItemType) =>
        set(state => {
          const updatedItem = {
            ...item,
            updatedAt: new Date().toISOString(),
            isSynced: false,
          } as Stringified<SyncMetadata<UpdateItemType>>

          const updatedItems = state.items.map(oldItem =>
            oldItem.itemID === updatedItem.itemID
              ? {
                  ...oldItem,
                  ...updatedItem,
                  recurring: (updatedItem as UpdateTaskType)
                    ? {
                        ...(updatedItem as Stringified<UpdateTaskType>)
                          ?.recurring,
                        progress: oldItem?.recurring?.progress || 0,
                      }
                    : null,
                }
              : oldItem
          ) as SyncMetadata<ResponseItem>[]

          return { items: updatedItems }
        }),
      updateItemProgress: (req: UpdateItemProgressReq) =>
        set(state => ({
          items: state.items.map(item =>
            item.itemID === req.itemID
              ? {
                  ...item,
                  timeSpent: item.timeSpent + req.timeSpent,
                  updatedAt: new Date().toISOString(),
                  isSynced: false,
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
                  updatedAt: new Date().toISOString(),
                  isSynced: false,
                }
              : item
          )

          return { items: newItems }
        }),
      deleteItem: (req: DeleteItemReq) =>
        set(state => {
          let deleteItemIDs = [req.itemID]

          if (req.deleteAssociated) {
            if (req.itemType === "GOAL") {
              const associatedTasks = state.items
                .filter(i => i.type === "TASK" && i.parentID === req.itemID)
                .map(task => task.itemID)

              deleteItemIDs.push(...associatedTasks)
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

              deleteItemIDs.push(...associatedGoals, ...associatedTasks)
            }
          }

          return {
            deletedItemIDs: deleteItemIDs,
            items: state.items.filter(
              item => !deleteItemIDs.includes(item.itemID)
            ),
          }
        }),
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
  return {
    ...itemStore(getFormattedItems),
    setItems: itemStore(state => state.setItems),
    addItem: itemStore(state => state.addItem),
    updateItem: itemStore(state => state.updateItem),
  }
}

export default useItems
