import React, { useCallback, useMemo, useState } from "react"
import { router } from "expo-router"
import { GestureResponderEvent, View } from "react-native"
import Animated from "react-native-reanimated"
import { genericMemo } from "@/types/generalTypes"
import { Dream, FormattedItem, Goal, ItemType, Task } from "@/types/itemTypes"

import useEditItem from "../../itemModal/hooks/useEditItem"
import useItemListConfig from "../hooks/useItemListConfig"
import { ItemStrip, RecurringItemStrip } from "./ItemStrip"
import ItemSublist from "./ItemSublist"

function Item<T extends FormattedItem>({
  itemType,
  item,
}: {
  item: T
  itemType: ItemType
}) {
  const { setEditItem } = useEditItem()
  const isItemCollapsed = useItemListConfig.use.isItemCollapsed()
  const saveCollapseState = useItemListConfig.use.saveCollapseState()
  const [showSublist, setShowSublist] = useState(!isItemCollapsed(item))

  const toggleSublist = () => {
    const newState = !showSublist
    setShowSublist(newState)
    saveCollapseState(
      { item_id: item.item_id, itemType: item.item_type },
      !newState
    )
  }

  const itemSublist = useMemo(() => {
    return itemType === "GOAL"
      ? (item as Goal).tasks
      : item.item_type === "DREAM"
        ? (item as Dream).goals
        : undefined
  }, [itemType])
  const containsSublist = !!itemSublist?.length

  const toggleEditClick = useCallback(
    (e: GestureResponderEvent) => {
      e.stopPropagation()
      setEditItem(item)
      router.push("/(modals)/(items)/edit-item")
    },
    [setEditItem]
  )

  const isRecurring = itemType === "TASK" && !!(item as Task).rec_times

  return (
    <View>
      {isRecurring ? (
        <RecurringItemStrip
          item={item as Task}
          toggleEditClick={toggleEditClick}
        />
      ) : (
        <Animated.View style={{ zIndex: (itemSublist || []).length + 1 }}>
          <ItemStrip
            item={item}
            itemType={itemType}
            toggleSublist={itemSublist?.length ? toggleSublist : undefined}
            itemSublist={itemSublist}
            toggleEditClick={toggleEditClick}
          />
        </Animated.View>
      )}
      {showSublist ? (
        <>
          {containsSublist && (
            <ItemSublist
              parent_id={item.item_id}
              key={`${itemType}_${item.item_id}_sublist`}
              subitems={itemSublist || []}
              subitemType={itemType === "DREAM" ? "GOAL" : "TASK"}
              showSublist={showSublist}
            />
          )}
        </>
      ) : (
        <>
          {containsSublist && (
            <ItemSublist
              parent_id={item.item_id}
              key={`${itemType}_${item.item_id}_sublist`}
              subitems={itemSublist || []}
              subitemType={itemType === "DREAM" ? "GOAL" : "TASK"}
              showSublist={showSublist}
            />
          )}
        </>
      )}
    </View>
  )
}

const ItemMemo = genericMemo(Item)

export default ItemMemo
