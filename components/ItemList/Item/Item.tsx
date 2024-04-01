"use client"

import React, { useState } from "react"
import { GestureResponderEvent, View } from "react-native"
import Animated from "react-native-reanimated"
import { Dream, FormattedItem, Goal, ItemType, Task } from "@/types/itemTypes"

import useEditItem from "../../itemModal/hooks/useEditItem"
import useItemListConfig from "../hooks/useItemListConfig"
import { ItemStrip, RecurringItemStrip } from "./ItemStrip"
import ItemSublist from "./ItemSublist"

export default function Item<T extends FormattedItem>({
  idx,
  itemType,
  item,
}: {
  idx: number
  item: T
  itemType: ItemType
}) {
  const { editItem, setEditItem } = useEditItem()
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

  const showEditPanel =
    editItem?.type === item.type && editItem?.itemID === item.itemID

  const toggleEditClick = (e: GestureResponderEvent) => {
    e.stopPropagation()
    setEditItem(showEditPanel ? undefined : item)
  }

  const isRecurring = itemType === "TASK" && !!(item as Task).recurring

  //   const EditPanel =
  //     item.status === "ARCHIVED" ? ArchivedItemEditPanel : ItemEditPanel

  return (
    <View
      //   layout
      //   ref={item_scope}
      id={`li_${item.itemID}${showSublist ? "" : "_COLLAPSED"}`}
    >
      {isRecurring ? (
        <RecurringItemStrip
          item={item as Task}
          showEditPanel={showEditPanel}
          toggleEditClick={toggleEditClick}
        />
      ) : (
        <Animated.View style={{ zIndex: (itemSublist || []).length + 1 }}>
          <ItemStrip
            item={item}
            itemType={itemType}
            toggleSublist={toggleSublist}
            itemSublist={itemSublist}
            showEditPanel={showEditPanel}
            toggleEditClick={toggleEditClick}
          />
        </Animated.View>
      )}
      {showSublist ? (
        <>
          {/* <AnimatePresence initial={false}>
            {showEditPanel && (
              <EditPanel<T>
                key={`${itemType}_${item.itemID}_edit_panel`}
                item={item}
                sublistVisible={showSublist && showEditPanel}
                showAddTask={itemType === "GOAL"}
              />
            )}
          </AnimatePresence> */}
          {containsSublist && (
            <ItemSublist
              parentID={item.itemID}
              key={`${itemType}_${item.itemID}_sublist`}
              subitems={itemSublist || []}
              subitemType={itemType === "DREAM" ? "GOAL" : "TASK"}
              showSublist={showSublist}
              isParentEditActive={showEditPanel}
              isParentArchived={item.status === "ARCHIVED"}
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
              isParentEditActive={showEditPanel}
              isParentArchived={item.status === "ARCHIVED"}
            />
          )}
          {/* <AnimatePresence initial={false}>
            {showEditPanel && (
              <EditPanel<T>
                key={`${itemType}_${item.itemID}_edit_panel`}
                item={item}
                sublistVisible={showSublist && showEditPanel}
                showAddTask={itemType === "GOAL"}
              />
            )}
          </AnimatePresence> */}
        </>
      )}
    </View>
  )
}
