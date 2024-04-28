import { useItemsList } from "@/api-endpoints/hooks/items/useItemsList"
import {
  filterItemsByStatus,
  groupItemsByParent,
} from "@/api-endpoints/utils/helpers"
import { Dream, Goal, ItemStatus, Task } from "@/types/itemTypes"

import useItemListConfig from "./hooks/useItemListConfig"
import ItemsList from "./ItemsList"

export default function ItemListWrapper() {
  const itemType = useItemListConfig.use.itemType()
  const showArchivedItems = useItemListConfig.use.showArchivedItems()
  const showCompletedItems = useItemListConfig.use.showCompletedItems()
  const { data, error, isLoading } = useItemsList()

  const items =
    itemType === "TASK"
      ? data?.tasks
      : itemType === "GOAL"
        ? data?.goals
        : data?.dreams

  const filterBy = [
    "ACTIVE" as ItemStatus,
    ...(showArchivedItems ? ["ARCHIVED" as ItemStatus] : []),
    ...(showCompletedItems ? ["COMPLETED" as ItemStatus] : []),
  ]
  const itemsWithStatus = filterItemsByStatus(filterBy, items)

  const groupedItems = itemsWithStatus
    ? groupItemsByParent(itemsWithStatus, itemType)
    : {}

  console.log('groupedItems', data, groupedItems)

  return (
    <ItemsList<Task | Goal | Dream>
      groupedItems={groupedItems}
      itemType={itemType}
    />
  )
}
