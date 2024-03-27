import { useItemsList } from "@/api-endpoints/hooks/items/useItemsList"
import {
  filterItemsByStatus,
  groupItemsByParent,
} from "@/api-endpoints/utils/helpers"
import MOCK_ITEMS from "@/data/items.json"
import {
  Dream,
  FormattedItems,
  Goal,
  ItemStatus,
  Task,
} from "@/types/itemTypes"

import useItemListConfig from "./hooks/useItemListConfig"
import ItemsList from "./ItemsList"

export default function ItemListWrapper() {
  const { itemType, showArchivedItems, showCompletedItems } =
    useItemListConfig()
  const { data: none, error, isLoading } = useItemsList()
  const data = MOCK_ITEMS as FormattedItems | undefined

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

  return (
    <ItemsList<Task | Goal | Dream>
      groupedItems={groupedItems}
      itemType={itemType}
    />
  )
}
