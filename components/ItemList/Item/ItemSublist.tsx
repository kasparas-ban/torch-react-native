import React, { Fragment, useCallback, useEffect } from "react"
import { useItemsList } from "@/api-endpoints/hooks/items/useItemsList"
import { findItemByID } from "@/api-endpoints/utils/helpers"
import RotateIcon from "@/assets/icons/rotate.svg"
import Colors from "@/constants/Colors"
import { router } from "expo-router"
import { GestureResponderEvent, useColorScheme, View } from "react-native"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { GeneralItem, Task } from "@/types/itemTypes"
import useEditItem from "@/components/itemModal/hooks/useEditItem"

import { ItemStrip, RecurringItemStrip } from "./ItemStrip"

const STRIP_HEIGHT = 48

export default function ItemSublist({
  parentID,
  subitems,
  subitemType,
  showSublist,
}: {
  parentID: string
  subitems: GeneralItem[]
  subitemType: "TASK" | "GOAL"
  showSublist: boolean
}) {
  const { data } = useItemsList()
  const { setEditItem } = useEditItem()

  const toggleEditClick = (e: GestureResponderEvent, subitem: GeneralItem) => {
    e.stopPropagation()
    const formattedItem = findItemByID(subitem.itemID, data)
    setEditItem(formattedItem)
    router.push("/(modals)/(items)/edit-item")
  }

  const isRecurring = (item: GeneralItem) => !!item.recurring

  const animVal = useSharedValue(0)

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
            ]}
          >
            <BulletPoint
              idx={idx}
              showSublist={showSublist}
              subitems={subitems}
            />
            {isRecurring(subitem) ? (
              <RecurringItemStrip
                item={subitem as Task}
                toggleEditClick={e => toggleEditClick(e, subitem)}
                isSublistCollapsed={!showSublist}
                isSublistItem
              />
            ) : (
              <ItemStrip
                item={subitem}
                itemType={subitemType}
                toggleEditClick={(e: GestureResponderEvent) => {
                  toggleEditClick(e, subitem)
                }}
                isSublistCollapsed={!showSublist}
                isSublistItem
              />
            )}
          </Animated.View>
        </Fragment>
      ))}
    </Animated.View>
  )
}

function BulletPoint({
  idx,
  showSublist,
  subitems,
}: {
  idx: number
  showSublist: boolean
  subitems: GeneralItem[]
}) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const isRecurring = (subitems[idx] as Task).recurring

  const bulletColor =
    isRecurring && !isDark ? Colors.amber[200] : Colors.gray[300]

  const animVal = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(animVal.value, [0, 1], [0, 14 + 12]),
      opacity: animVal.value,
    }
  })

  useEffect(() => {
    animVal.value = showSublist ? 1 : 0
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
            color={isDark ? "white" : Colors.gray[500]}
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
