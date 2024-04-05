import { useEffect } from "react"
import DotsIcon from "@/assets/icons/dots.svg"
import Colors from "@/constants/Colors"
import { Dimensions, GestureResponderEvent, Text, View } from "react-native"
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import TextTicker from "react-native-text-ticker"
import { GeneralItem, ItemType, Task } from "@/types/itemTypes"
import { toPercent } from "@/utils/utils"
import { AnimatedButton } from "@/components/AnimatedButton"
import useEditItem from "@/components/itemModal/hooks/useEditItem"

import { getStripBgColor, getStripPercentageColor } from "./itemStripColors"
import ItemProgress from "./ProgressBar"

const fullStripWidth = Dimensions.get("window").width - 2 * 14

function ItemStrip<T extends GeneralItem>({
  item,
  toggleSublist,
  itemSublist,
  toggleEditClick,
  isSublistItem,
  isSublistCollapsed,
}: {
  item: T
  itemType: ItemType
  toggleSublist?: () => void
  itemSublist?: GeneralItem[]
  toggleEditClick: (e: GestureResponderEvent) => void
  isSublistItem?: boolean
  isSublistCollapsed?: boolean
}) {
  const { editItem, setEditItem } = useEditItem()
  const isActive = item.status === "ACTIVE"

  const handleStripClick = () => {
    const itemInEdit =
      item.itemID === editItem?.itemID && item.type === editItem?.type
    if (itemInEdit) {
      setEditItem(undefined)
    } else if (!editItem && toggleSublist) {
      toggleSublist()
    }
  }

  const stripBgColor = getStripBgColor(item.status, false)
  const stripPercentageColor = getStripPercentageColor(item.status)

  const stripWidth = isSublistItem ? fullStripWidth - (14 + 12) : fullStripWidth
  const width = useSharedValue(100)

  const animatedStyles = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }))

  useEffect(() => {
    const widthVal = isSublistCollapsed
      ? fullStripWidth
      : stripWidth - (isSublistItem ? 12 : 0)

    const widthFraction =
      (widthVal /
        (!isSublistCollapsed && isSublistItem
          ? fullStripWidth - 12
          : fullStripWidth)) *
      100

    width.value = withTiming(widthFraction, {
      duration: 200,
    })
  }, [isSublistCollapsed])

  return (
    <View
      style={[
        {
          zIndex: itemSublist?.length,
          maxHeight: 48,
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        },
      ]}
    >
      <AnimatedButton
        onPress={() => !isSublistCollapsed && handleStripClick()}
        scale={isSublistCollapsed ? 1 : 0.98}
        opacity={1}
        style={[
          {
            flexDirection: "row",
            backgroundColor: stripBgColor,
            borderWidth: 1,
            borderRadius: 16,
            borderColor: Colors.gray[700],
            paddingLeft: 18,
            paddingRight: 4,
            overflow: "hidden",
          },
          animatedStyles,
        ]}
      >
        <ItemProgress progress={item.progress || 0} />
        <View style={{ paddingVertical: 14, flex: 1 }}>
          <TextTicker
            style={{ color: Colors.gray[800] }}
            duration={6000}
            repeatSpacer={50}
            marqueeDelay={1500}
            bounce={false}
            loop
          >
            {item.title}
          </TextTicker>
        </View>
        <View
          style={{
            justifyContent: "center",
            paddingLeft: 4,
            paddingRight: 4,
            flex: 0,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "900",
              color: stripPercentageColor,
            }}
          >
            {item.status === "COMPLETED" ? "100%" : toPercent(item.progress)}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 0,
          }}
        >
          <AnimatedButton
            onPress={toggleEditClick}
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 30,
              width: 30,
              borderRadius: 100,
            }}
          >
            <DotsIcon
              style={{
                width: 26,
                height: 26,
              }}
              color={isActive ? Colors.gray[500] : Colors.gray[400]}
            />
          </AnimatedButton>
        </View>
      </AnimatedButton>
    </View>
  )
}

function RecurringItemStrip({
  item,
  toggleEditClick,
  isSublistCollapsed,
  isSublistItem,
}: {
  item: Task
  toggleEditClick: (e: GestureResponderEvent) => void
  isSublistCollapsed?: boolean
  isSublistItem?: boolean
}) {
  const { editItem, setEditItem } = useEditItem()

  const isActive = item.status === "ACTIVE"
  const itemProgress = item.recurring
    ? (item.recurring?.progress || 0) / item.recurring?.times
    : 0

  const handleStripClick = () => {
    const itemInEdit =
      item.itemID === editItem?.itemID && item.type === editItem?.type
    if (itemInEdit) setEditItem(undefined)
  }

  const stripBgColor = getStripBgColor(item.status, true)

  const stripPercentageColor = getStripPercentageColor(item.status, true)

  const stripWidth = isSublistItem ? fullStripWidth - (14 + 12) : fullStripWidth
  const width = useSharedValue(100)

  const animatedStyles = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }))

  useEffect(() => {
    const widthVal = isSublistCollapsed
      ? fullStripWidth
      : stripWidth - (isSublistItem ? 12 : 0)

    const widthFraction =
      (widthVal /
        (!isSublistCollapsed && isSublistItem
          ? fullStripWidth - 12
          : fullStripWidth)) *
      100

    width.value = withTiming(widthFraction, {
      duration: 200,
    })
  }, [isSublistCollapsed])

  return (
    <View
      style={{
        maxHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
      }}
    >
      <AnimatedButton
        style={[
          {
            flexDirection: "row",
            backgroundColor: stripBgColor,
            borderWidth: 1,
            borderRadius: 16,
            borderColor: Colors.gray[700],
            paddingLeft: 18,
            paddingRight: 4,
            overflow: "hidden",
          },
          animatedStyles,
        ]}
        onPress={handleStripClick}
        scale={isSublistCollapsed ? 1 : 0.98}
        opacity={1}
      >
        {item.status !== "COMPLETED" && (
          <ItemProgress progress={itemProgress} isRecurring />
        )}
        <View style={{ flex: 1, paddingVertical: 6 }}>
          <Text style={{ color: Colors.gray[800] }}>{item.title}</Text>
          <Text style={{ color: Colors.gray[700], fontSize: 12 }}>
            {isActive ? "Resets tomorrow" : "Repeats every week"}
          </Text>
        </View>
        <View
          style={{ justifyContent: "center", paddingLeft: 4, paddingRight: 4 }}
        >
          <Text
            style={{
              letterSpacing: 3,
              fontSize: 24,
              fontWeight: "900",
              color: stripPercentageColor,
            }}
          >
            {item.recurring?.progress || 0}/{item.recurring?.times}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AnimatedButton
            onPress={toggleEditClick}
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 30,
              width: 30,
              borderRadius: 100,
            }}
          >
            <DotsIcon
              style={{
                width: 26,
                height: 26,
              }}
              color={isActive ? Colors.gray[500] : Colors.gray[400]}
            />
          </AnimatedButton>
        </View>
      </AnimatedButton>
      {/* {isActive && showEditPanel && (
        <Animated.View
          style={{
            flexDirection: "row",
            position: "absolute",
            right: isSublistItem ? 26 : 0,
          }}
          entering={FadeIn(0.8)}
          exiting={FadeOut(0.8)}
        >
          <AnimatedButton
            key="add_recurring"
            style={{
              backgroundColor: Colors.amber[400],
              borderRadius: 100,
              width: 42,
              height: 42,
              marginLeft: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "900",
                color: Colors.gray[700],
              }}
            >
              -1
            </Text>
          </AnimatedButton>
          <AnimatedButton
            key="subtract_recurring"
            style={{
              backgroundColor: Colors.amber[400],
              borderRadius: 100,
              width: 42,
              height: 42,
              marginLeft: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "900",
                color: Colors.gray[700],
              }}
            >
              +1
            </Text>
          </AnimatedButton>
        </Animated.View>
      )} */}
    </View>
  )
}

export { ItemStrip, RecurringItemStrip }
