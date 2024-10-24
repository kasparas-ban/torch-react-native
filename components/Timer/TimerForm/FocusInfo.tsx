import TimerIcon from "@/assets/icons/navigationIcons/timer.svg"
import TimerBoldIcon from "@/assets/icons/timerBold.svg"
import Colors from "@/constants/Colors"
import { findFormattedItem } from "@/stores/helpers"
import useItems from "@/stores/itemStore"
import { StyleSheet, Text, View } from "react-native"
import { Dream, Goal, Task } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { formatPercentages, formatSpentTime } from "@/utils/utils"

import useTimerForm from "../hooks/useTimerForm"

export default function FocusInfo() {
  const { focusItemId } = useTimerForm()
  const { allItems } = useItems()
  const focusItem = findFormattedItem(allItems, focusItemId)

  return focusItem ? (
    focusItem.item_type === "TASK" ? (
      <TaskInfo focusItem={focusItem as Task} />
    ) : (
      <ParentInfo focusItem={focusItem as Goal | Dream} />
    )
  ) : null
}

const TaskInfo = ({ focusItem }: { focusItem: Task }) => {
  const { isDark } = useThemeStyles(componentStyles)

  const showProgress = !!focusItem.duration
  const timeLeft =
    focusItem.duration && focusItem.time_spent
      ? focusItem.duration - focusItem.time_spent
      : undefined

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 12,
      }}
    >
      {showProgress && (
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 48,
              fontWeight: "700",
              color: isDark ? Colors.gray[100] : Colors.gray[800],
            }}
          >
            {formatPercentages(focusItem.progress)}
          </Text>
          <Text
            style={{
              fontSize: 42,
              fontWeight: "700",
              textAlignVertical: "bottom",
              marginBottom: 2,
              color: isDark ? Colors.gray[100] : Colors.gray[800],
            }}
          >
            %
          </Text>
        </View>
      )}
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: "row" }}>
          <TimerBoldIcon
            color={isDark ? Colors.gray[200] : Colors.gray[800]}
            style={{ width: 20, height: 20, marginRight: 4 }}
          />
          <Text
            style={{
              marginRight: 4,
              fontWeight: "700",
              color: isDark ? Colors.gray[300] : Colors.gray[800],
            }}
          >
            {formatSpentTime(focusItem.time_spent ?? 0)}
          </Text>
          <Text style={{ color: isDark ? Colors.gray[400] : Colors.gray[500] }}>
            spent
          </Text>
        </View>
        {timeLeft && (
          <View style={{ flexDirection: "row" }}>
            <TimerIcon
              color={isDark ? Colors.gray[200] : Colors.gray[800]}
              style={{ width: 20, height: 20, marginRight: 4 }}
            />
            <Text
              style={{
                marginRight: 4,
                fontWeight: "700",
                color: isDark ? Colors.gray[300] : Colors.gray[800],
              }}
            >
              {formatSpentTime(timeLeft)}
            </Text>
            <Text
              style={{ color: isDark ? Colors.gray[400] : Colors.gray[500] }}
            >
              left
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const ParentInfo = ({ focusItem }: { focusItem: Goal | Dream }) => {
  const { isDark } = useThemeStyles(componentStyles)
  const showProgress = !!focusItem.duration
  const timeLeft =
    focusItem.duration && focusItem.time_spent
      ? focusItem.duration - focusItem.time_spent
      : undefined

  const containsTasks =
    !!(focusItem as Goal).tasks?.length ||
    !!(focusItem as Dream).goals?.find(goal => !!(goal as Goal).tasks?.length)

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 12,
      }}
    >
      {showProgress && (
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 48,
              fontWeight: "700",
              color: isDark ? Colors.gray[100] : Colors.gray[800],
            }}
          >
            {formatPercentages(focusItem.progress)}
          </Text>
          <Text
            style={{
              fontSize: 42,
              fontWeight: "700",
              textAlignVertical: "bottom",
              marginBottom: 2,
              color: isDark ? Colors.gray[100] : Colors.gray[800],
            }}
          >
            %
          </Text>
        </View>
      )}
      <View style={{ gap: 4 }}>
        {focusItem.time_spent == undefined && (
          <View style={{ flexDirection: "row" }}>
            <TimerBoldIcon
              color={isDark ? Colors.gray[200] : Colors.gray[800]}
              style={{ width: 20, height: 20, marginRight: 4 }}
            />
            <Text
              style={{
                marginRight: 4,
                fontWeight: "700",
                color: isDark ? Colors.gray[300] : Colors.gray[800],
              }}
            >
              {formatSpentTime(focusItem.time_spent)}
            </Text>
            <Text
              style={{ color: isDark ? Colors.gray[400] : Colors.gray[500] }}
            >{`spent${containsTasks ? " on tasks" : ""}`}</Text>
          </View>
        )}
        {containsTasks ||
          (focusItem.totalTimeSpent !== undefined && (
            <View style={{ flexDirection: "row" }}>
              <TimerBoldIcon
                color={isDark ? Colors.gray[200] : Colors.gray[800]}
                style={{ width: 20, height: 20, marginRight: 4 }}
              />
              <Text
                style={{
                  marginRight: 4,
                  fontWeight: "700",
                  color: isDark ? Colors.gray[300] : Colors.gray[800],
                }}
              >
                {formatSpentTime(focusItem.totalTimeSpent)}
              </Text>
              <Text
                style={{ color: isDark ? Colors.gray[400] : Colors.gray[500] }}
              >
                spent in total
              </Text>
            </View>
          ))}
        {!!timeLeft && (
          <View style={{ flexDirection: "row" }}>
            <TimerIcon
              color={isDark ? Colors.gray[200] : Colors.gray[800]}
              style={{ width: 20, height: 20, marginRight: 4 }}
            />
            <Text
              style={{
                marginRight: 4,
                fontWeight: "700",
                color: isDark ? Colors.gray[300] : Colors.gray[800],
              }}
            >
              {formatSpentTime(50)}
            </Text>
            <Text
              style={{ color: isDark ? Colors.gray[400] : Colors.gray[500] }}
            >{`left ${focusItem.totalTimeSpent ? "on tasks" : ""}`}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    progress: {
      color: isDark ? Colors.gray[50] : Colors.gray[800],
    },
  })
