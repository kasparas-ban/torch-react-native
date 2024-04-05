"use client"

import React, { useState } from "react"
import { router } from "expo-router"
import { GestureResponderEvent, View } from "react-native"
import Animated from "react-native-reanimated"
import { Dream, FormattedItem, Goal, ItemType, Task } from "@/types/itemTypes"

import useEditItem from "../../itemModal/hooks/useEditItem"
import useItemListConfig from "../hooks/useItemListConfig"
import { ItemStrip, RecurringItemStrip } from "./ItemStrip"
import ItemSublist from "./ItemSublist"

export default function Item<T extends FormattedItem>({
  itemType,
  item,
}: {
  item: T
  itemType: ItemType
}) {
  const { setEditItem } = useEditItem()
  const { isItemCollapsed, saveCollapseState } = useItemListConfig()
  const [showSublist, setShowSublist] = useState(!isItemCollapsed(item))

  const itemSublist =
    itemType === "GOAL"
      ? (item as Goal).tasks
      : item.type === "DREAM"
        ? (item as Dream).goals
        : undefined
  const containsSublist = !!itemSublist?.length

  const toggleSublist = () => {
    const newState = !showSublist
    setShowSublist(newState)
    saveCollapseState({ itemId: item.itemID, itemType: item.type }, !newState)
  }

  const toggleEditClick = (e: GestureResponderEvent) => {
    e.stopPropagation()
    setEditItem(item)
    router.push("/(modals)/(items)/edit-item")
  }

  const isRecurring = itemType === "TASK" && !!(item as Task).recurring

  return (
    <View id={`li_${item.itemID}${showSublist ? "" : "_COLLAPSED"}`}>
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
            toggleSublist={toggleSublist}
            itemSublist={itemSublist}
            toggleEditClick={toggleEditClick}
          />
        </Animated.View>
      )}
      {showSublist ? (
        <>
          {containsSublist && (
            <ItemSublist
              parentID={item.itemID}
              key={`${itemType}_${item.itemID}_sublist`}
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
              parentID={item.itemID}
              key={`${itemType}_${item.itemID}_sublist`}
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
