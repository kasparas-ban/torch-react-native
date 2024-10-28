import React, { Fragment, useCallback, useEffect } from "react"
import RotateIcon from "@/assets/icons/rotate.svg"
import Colors from "@/constants/Colors"
import useItems from "@/stores/itemStore"
import { router } from "expo-router"
import { GestureResponderEvent, useColorScheme, View } from "react-native"
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { GeneralItem, Task } from "@/types/itemTypes"
import { findItemByID } from "@/api/utils/helpers"
import useEditItem from "@/components/itemModal/hooks/useEditItem"

import { ItemStrip, RecurringItemStrip } from "./ItemStrip"

const STRIP_HEIGHT = 48

export default function ItemSublist({
  parent_id,
  subitems,
  showSublist,
}: {
  parent_id: string
  subitems: GeneralItem[]
  showSublist: boolean
}) {
  const { allItems } = useItems()
  const { editItem, setEditItem } = useEditItem()

  const toggleEditClick = (e: GestureResponderEvent, subitem: GeneralItem) => {
    e.stopPropagation()
    if (editItem) return
    const formattedItem = findItemByID(subitem.item_id, allItems)
    setEditItem(formattedItem)
    router.push("/(modals)/(items)/edit-item")
  }

  const animVal = useSharedValue(0)

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
        <Subitem
          key={subitem.item_id}
          parent_id={parent_id}
          subitem={subitem}
          idx={idx}
          showSublist={showSublist}
          subitems={subitems}
          animVal={animVal}
          toggleEditClick={toggleEditClick}
        />
      ))}
    </Animated.View>
  )
}

function Subitem({
  parent_id,
  subitem,
  idx,
  showSublist,
  subitems,
  animVal,
  toggleEditClick,
}: {
  parent_id: string
  subitem: GeneralItem
  idx: number
  showSublist: boolean
  subitems: GeneralItem[]
  animVal: SharedValue<number>
  toggleEditClick: (e: GestureResponderEvent, subitem: GeneralItem) => void
}) {
  const animatedStyles = useAnimatedStyle(() => {
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
  })

  return (
    <Fragment key={`${parent_id}_${subitem.item_id}`}>
      <Animated.View
        style={[
          {
            position: "relative",
            minHeight: STRIP_HEIGHT,
            flexDirection: "row",
            zIndex: subitems.length - 1 - idx,
            alignItems: "center",
          },
          animatedStyles,
        ]}
      >
        <BulletPoint idx={idx} showSublist={showSublist} subitems={subitems} />
        {!!subitem.rec_times ? (
          <RecurringItemStrip
            item={subitem as Task}
            toggleEditClick={e => toggleEditClick(e, subitem)}
            isSublistCollapsed={!showSublist}
            isSublistItem
          />
        ) : (
          <ItemStrip
            item={subitem}
            itemType={subitem.item_type}
            toggleEditClick={(e: GestureResponderEvent) => {
              toggleEditClick(e, subitem)
            }}
            isSublistCollapsed={!showSublist}
            isSublistItem
          />
        )}
      </Animated.View>
    </Fragment>
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

  const isRecurring = (subitems[idx] as Task).rec_times

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
