import TimerIcon from "@/assets/icons/navigationIcons/timer.svg"
import TimerBoldIcon from "@/assets/icons/timerBold.svg"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import { ItemOptionType } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { formatPercentages, formatSpentTime } from "@/utils/utils"

import useTimerForm from "../hooks/useTimerForm"

export default function FocusInfo() {
  const { focusOn } = useTimerForm()
  const { isDark } = useThemeStyles(componentStyles)

  const getFocusInfo = (focusItem: ItemOptionType) =>
    focusItem.type === "TASK" ? (
      <TaskInfo focusOn={focusItem} isDark={isDark} />
    ) : (
      <ParentInfo focusOn={focusItem} isDark={isDark} />
    )

  return focusOn && getFocusInfo(focusOn)
}

const TaskInfo = ({
  focusOn,
  isDark,
}: {
  focusOn: ItemOptionType
  isDark: boolean
}) => {
  const showProgress = !!focusOn.duration
  const timeLeft =
    focusOn.duration && focusOn.timeSpent
      ? focusOn.duration - focusOn.timeSpent
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
            {formatPercentages(focusOn.progress)}
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
            {formatSpentTime(focusOn.timeSpent ?? 0)}
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

const ParentInfo = ({
  focusOn,
  isDark,
}: {
  focusOn: ItemOptionType
  isDark: boolean
}) => {
  const showProgress = !!focusOn.duration
  const timeLeft =
    focusOn.duration && focusOn.timeSpent
      ? focusOn.duration - focusOn.timeSpent
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
            {formatPercentages(focusOn.progress)}
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
        {focusOn.timeSpent !== undefined && (
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
              {formatSpentTime(focusOn.timeSpent)}
            </Text>
            <Text
              style={{ color: isDark ? Colors.gray[400] : Colors.gray[500] }}
            >{`spent${focusOn.containsTasks ? " on tasks" : ""}`}</Text>
          </View>
        )}
        {focusOn?.containsTasks ||
          (focusOn.totalTimeSpent !== undefined && (
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
                {formatSpentTime(focusOn.totalTimeSpent)}
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
            >{`left ${focusOn.totalTimeSpent ? "on tasks" : ""}`}</Text>
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
