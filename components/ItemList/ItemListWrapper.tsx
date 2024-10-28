import useItems from "@/stores/itemStore"
import { Dream, Goal, ItemStatus, Task } from "@/types/itemTypes"
import { filterItemsByStatus, groupItemsByParent } from "@/api/utils/helpers"

import useItemListConfig from "./hooks/useItemListConfig"
import ItemsList from "./ItemsList"

export default function ItemListWrapper() {
  const itemType = useItemListConfig.use.itemType()
  const showArchivedItems = useItemListConfig.use.showArchivedItems()
  const showCompletedItems = useItemListConfig.use.showCompletedItems()
  const { tasks, goals, dreams } = useItems()

  const items =
    itemType === "TASK" ? tasks : itemType === "GOAL" ? goals : dreams

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
