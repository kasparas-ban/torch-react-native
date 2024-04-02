import { useEffect } from "react"
import DotsIcon from "@/assets/icons/dots.svg"
import TimerIcon from "@/assets/icons/navigationIcons/timer.svg"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { useRouter } from "expo-router"
import { Dimensions, GestureResponderEvent, Text, View } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import TextTicker from "react-native-text-ticker"
import {
  GeneralItem,
  Goal,
  ItemOptionType,
  ItemType,
  Task,
} from "@/types/itemTypes"
import { toPercent } from "@/utils/utils"
import { AnimatedButton } from "@/components/AnimatedButton"
import useEditItem from "@/components/itemModal/hooks/useEditItem"
import useTimerForm from "@/components/Timer/hooks/useTimerForm"

import {
  getStripBgColor,
  getStripBorderColor,
  getStripPercentageColor,
  getStripTextColor,
} from "./itemStripColors"
import ItemProgress from "./ProgressBar"

function ItemStrip<T extends GeneralItem>({
  item,
  itemType,
  toggleSublist,
  itemSublist,
  showEditPanel,
  toggleEditClick,
  disableClick,
}: {
  item: T
  itemType: ItemType
  toggleSublist?: () => void
  itemSublist?: GeneralItem[]
  showEditPanel: boolean
  toggleEditClick: (e: GestureResponderEvent) => void
  disableClick?: boolean
}) {
  const { editItem, setEditItem } = useEditItem()
  const router = useRouter()
  const { setFocusOn, setFocusType } = useTimerForm()

  const containsSublist = !!itemSublist?.length
  const isActive = item.status === "ACTIVE"

  const handleTimerClick = () => {
    const itemOption: ItemOptionType = {
      value: item.itemID,
      label: item.title,
      type: item.type,
      progress: item.progress,
      timeSpent: item.timeSpent,
      duration: (editItem as Task).duration ?? undefined,
      containsTasks: !!(editItem as Goal).tasks?.length,
    }

    setFocusType(
      itemType === "TASK"
        ? "TASKS"
        : itemType === "GOAL"
          ? "GOALS"
          : itemType === "DREAM"
            ? "DREAMS"
            : "ALL"
    )
    setFocusOn(itemOption)
    router.push("/(tabs)/timer")
  }

  const handleStripClick = () => {
    const itemInEdit =
      item.itemID === editItem?.itemID && item.type === editItem?.type
    if (itemInEdit) {
      setEditItem(undefined)
    } else if (!editItem && toggleSublist) {
      toggleSublist()
    }
  }

  const stripBgColor = getStripBgColor(!!editItem, showEditPanel, item.status)
  const stripTextColor = getStripTextColor(isActive)
  const stripBorderColor = getStripBorderColor(isActive)

  const stripPercentageColor = getStripPercentageColor(
    !!editItem,
    showEditPanel,
    item.status
  )

  const width = useSharedValue(380)

  const animatedStyles = useAnimatedStyle(() => ({
    width: width.value,
  }))

  useEffect(() => {
    const stripWidth = Dimensions.get("window").width - 2 * 14
    const timerWidth = 42 + 12

    width.value = withTiming(
      showEditPanel && item.status === "ACTIVE"
        ? stripWidth - timerWidth
        : stripWidth,
      {
        duration: 200,
      }
    )
  }, [showEditPanel])

  return (
    <View
      style={[
        {
          zIndex: itemSublist?.length,
          maxHeight: 48,
          flexDirection: "row",
          alignItems: "center",
        },
      ]}
    >
      <AnimatedButton
        onPress={() => !disableClick && handleStripClick()}
        scale={disableClick ? 1 : 0.97}
        opacity={1}
        style={[
          {
            flexDirection: "row",
            backgroundColor: stripBgColor,
            borderWidth: 1,
            borderRadius: 16,
            borderColor: stripBorderColor,
            paddingLeft: 18,
            paddingRight: 4,
            overflow: "hidden",
          },
          animatedStyles,
        ]}
      >
        <ItemProgress
          progress={item.progress || 0}
          showEditPanel={showEditPanel}
          isActive={isActive}
        />
        <View style={{ paddingVertical: 14, flex: 1 }}>
          <TextTicker
            style={{ color: stripTextColor }}
            duration={6000}
            repeatSpacer={50}
            marqueeDelay={1500}
            loop
            bounce={false}
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
      {showEditPanel && item.status === "ACTIVE" && (
        <AnimatedButton
          style={{
            backgroundColor: Colors.red[400],
            borderRadius: 100,
            width: 42,
            height: 42,
            marginLeft: 12,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            right: 0,
          }}
          entering={FadeIn(0.8)}
          exiting={FadeOut(0.8)}
        >
          <TimerIcon
            color={Colors.gray[600]}
            style={{ width: 30, height: 30 }}
          />
        </AnimatedButton>
      )}
    </View>
  )
}

function RecurringItemStrip({
  item,
  showEditPanel,
  toggleEditClick,
  disableClick,
}: {
  item: Task
  showEditPanel: boolean
  toggleEditClick: (e: GestureResponderEvent) => void
  disableClick?: boolean
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

  const stripBgColor = getStripBgColor(
    !!editItem,
    showEditPanel,
    item.status,
    true
  )
  const stripTextColor = getStripTextColor(isActive)
  const stripBorderColor = getStripBorderColor(isActive)

  const stripPercentageColor = getStripPercentageColor(
    !!editItem,
    showEditPanel,
    item.status,
    true
  )

  const width = useSharedValue(380)

  const animatedStyles = useAnimatedStyle(() => ({
    width: width.value,
  }))

  useEffect(() => {
    const stripWidth = Dimensions.get("window").width - 2 * 14
    const timerWidth = (42 + 12) * 2

    width.value = withTiming(
      showEditPanel && isActive ? stripWidth - timerWidth : stripWidth,
      {
        duration: 200,
      }
    )
  }, [showEditPanel])

  return (
    <View style={{ maxHeight: 48, flexDirection: "row", alignItems: "center" }}>
      <AnimatedButton
        style={[
          {
            flexDirection: "row",
            backgroundColor: stripBgColor,
            borderWidth: 1,
            borderRadius: 16,
            borderColor: stripBorderColor,
            paddingLeft: 18,
            paddingRight: 4,
            overflow: "hidden",
          },
          animatedStyles,
        ]}
        onPress={handleStripClick}
        scale={disableClick ? 1 : 0.97}
        opacity={1}
      >
        {item.status !== "COMPLETED" && (
          <ItemProgress
            progress={itemProgress}
            showEditPanel={showEditPanel}
            isActive={isActive}
            isRecurring
          />
        )}
        <View style={{ flex: 1, paddingVertical: 6 }}>
          <Text style={{ color: stripTextColor }}>{item.title}</Text>
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
      {isActive && showEditPanel && (
        <Animated.View
          style={{ flexDirection: "row", position: "absolute", right: 0 }}
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
      )}
    </View>
  )
}

export { ItemStrip, RecurringItemStrip }
