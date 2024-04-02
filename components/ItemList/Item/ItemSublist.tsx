import React, { Fragment, useCallback, useEffect } from "react"
import { useItemsList } from "@/api-endpoints/hooks/items/useItemsList"
import { findItemByID } from "@/api-endpoints/utils/helpers"
import RotateIcon from "@/assets/icons/rotate.svg"
import Colors from "@/constants/Colors"
import { Dimensions, GestureResponderEvent, View } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { GeneralItem, Task } from "@/types/itemTypes"
import useEditItem from "@/components/itemModal/hooks/useEditItem"

import { ItemStrip, RecurringItemStrip } from "./ItemStrip"

const STRIP_HEIGHT = 48

const stripWidth = Dimensions.get("window").width - 24

export default function ItemSublist({
  parentID,
  subitems,
  subitemType,
  showSublist,
  isParentEditActive,
  isParentArchived,
}: {
  parentID: string
  subitems: GeneralItem[]
  subitemType: "TASK" | "GOAL"
  showSublist: boolean
  isParentEditActive: boolean
  isParentArchived: boolean
}) {
  const { data } = useItemsList()
  const { editItem, setEditItem } = useEditItem()

  const showEditPanel = (subitem: GeneralItem) =>
    subitem.type === editItem?.type && subitem.itemID === editItem?.itemID

  const toggleEditClick = (e: GestureResponderEvent, subitem: GeneralItem) => {
    e.stopPropagation()
    const formattedItem = findItemByID(subitem.itemID, data)
    setEditItem(showEditPanel(subitem) ? undefined : formattedItem)
  }

  const isRecurring = (item: GeneralItem) => !!item.recurring

  const animVal = useSharedValue(0)
  const animWidth = useSharedValue(stripWidth)

  const getAnimatedStyles = useCallback(
    (idx: number) =>
      useAnimatedStyle(() => {
        return {
          opacity: idx > 1 ? 1 - animVal.value : 1,
          transform: [
            { scale: 1 - 0.04 * animVal.value - 0.03 * idx * animVal.value },
            {
              translateY:
                12 * (1 - animVal.value) + animVal.value * (-43 + -61 * idx),
            },
          ],
        }
      }),
    []
  )

  const stripStyle = useAnimatedStyle(() => {
    return {
      width: `${animWidth.value}%`,
    }
  })

  useEffect(() => {
    animWidth.value = withTiming(
      !showSublist && isParentEditActive && !isParentArchived
        ? ((stripWidth - 54) / stripWidth) * 100
        : 100
    )
  }, [isParentEditActive])

  useEffect(() => {
    animVal.value = withSpring(showSublist ? 0 : 1, {
      mass: 0.4,
      damping: 10,
      stiffness: 200,
      overshootClamping: false,
      restDisplacementThreshold: 0.001,
    })
  }, [showSublist])

  const animatedHeight = useAnimatedStyle(() => ({
    height: Math.max(
      0,
      (1 - animVal.value) * (STRIP_HEIGHT + 12) * subitems.length
    ),
  }))

  return (
    <Animated.View style={[{ gap: 12, marginBottom: 12 }, animatedHeight]}>
      {subitems.map((subitem, idx) => (
        <Fragment key={`${parentID}_${subitem.itemID}`}>
          <Animated.View
            style={[
              {
                position: "relative",
                minHeight: STRIP_HEIGHT,
                flexDirection: "row",
                zIndex: subitems.length - 1 - idx,
                alignItems: "center",
              },
              getAnimatedStyles(idx),
              stripStyle,
            ]}
          >
            <BulletPoint
              idx={idx}
              showSublist={showSublist}
              showEditPanel={showEditPanel}
              subitems={subitems}
            />
            {isRecurring(subitem) ? (
              <RecurringItemStrip
                item={subitem as Task}
                showEditPanel={showEditPanel(subitem)}
                toggleEditClick={e => toggleEditClick(e, subitem)}
                isSublistCollapsed={!showSublist}
                isSublistItem
              />
            ) : (
              <ItemStrip
                item={subitem}
                itemType={subitemType}
                showEditPanel={showEditPanel(subitem)}
                toggleEditClick={(e: GestureResponderEvent) => {
                  toggleEditClick(e, subitem)
                }}
                isSublistCollapsed={!showSublist}
                isSublistItem
              />
            )}
          </Animated.View>
          {/* <AnimatePresence initial={false}>
            {showEditPanel(subitem) && (
              <EditPanel idx={idx} subitem={subitem} subitems={subitems} />
            )}
          </AnimatePresence> */}
        </Fragment>
      ))}
    </Animated.View>
  )
}

// function EditPanel({
//   idx,
//   subitem,
//   subitems,
// }: {
//   idx: number
//   subitem: GeneralItem
//   subitems: GeneralItem[]
// }) {
//   const Panel =
//     subitem.status === "ARCHIVED" ? ArchivedItemEditPanel : ItemEditPanel

//   return (
//     <Panel
//       key={`task_${subitem.itemID}_edit_panel`}
//       item={subitem}
//       showBulletLine={idx !== subitems.length - 1}
//     />
//   )
// }

function BulletPoint({
  idx,
  showSublist,
  subitems,
}: {
  idx: number
  showSublist: boolean
  showEditPanel: (subitem: GeneralItem) => boolean
  subitems: GeneralItem[]
}) {
  const { editItem } = useEditItem()
  const currentItem = subitems[idx]
  const isRecurring = (currentItem as Task).recurring

  const editItemActive =
    editItem?.type === currentItem.type &&
    editItem?.itemID === currentItem.itemID

  const bulletColor = editItem
    ? editItemActive && isRecurring
      ? Colors.amber[200]
      : Colors.gray[300]
    : isRecurring
      ? Colors.amber[200]
      : Colors.gray[300]

  const animWidth = useSharedValue(0)
  const animOpacity = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return { width: animWidth.value, opacity: animOpacity.value }
  })

  useEffect(() => {
    animWidth.value = showSublist ? 14 + 12 : 0
    animOpacity.value = showSublist ? 1 : 0
  }, [showSublist])

  return (
    <Animated.View style={[{ position: "relative", width: 0 }, animatedStyle]}>
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 10,
          backgroundColor: bulletColor,
        }}
      />
      {isRecurring && (
        <View
          style={{
            position: "absolute",
            top: -2,
            left: -2,
          }}
        >
          <RotateIcon
            color={Colors.gray[500]}
            style={{ width: 20, height: 20 }}
          />
        </View>
      )}
      {/* Upper line */}
      {idx !== 0 && (
        <View
          style={{
            position: "absolute",
            height: "50%",
            backgroundColor: Colors.gray[300],
            width: 4,
            left: 6,
            top: -STRIP_HEIGHT / 4,
          }}
        />
      )}
      {/* Lower line */}
      {idx !== subitems.length - 1 && (
        <View
          style={{
            position: "absolute",
            height: "75%",
            backgroundColor: Colors.gray[300],
            width: 4,
            left: 6,
            transform: [{ translateY: 0.75 * 0.5 * STRIP_HEIGHT - 6 }],
          }}
        />
      )}
    </Animated.View>
  )
}
