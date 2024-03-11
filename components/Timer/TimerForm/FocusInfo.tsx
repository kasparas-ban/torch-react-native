import TimerIcon from "@/assets/icons/navigationIcons/timer.svg"
import TimerBoldIcon from "@/assets/icons/timerBold.svg"
import Colors from "@/constants/Colors"
import { Text, View } from "react-native"
import { ItemOptionType } from "@/types/itemTypes"
import { formatPercentages, formatTimeSpent } from "@/utils/utils"

import useTimerForm from "../hooks/useTimerForm"

export default function FocusInfo() {
  const { focusOn } = useTimerForm()

  const getFocusInfo = (focusItem: ItemOptionType) =>
    focusItem.type === "TASK" ? (
      <TaskInfo focusOn={focusItem} />
    ) : (
      <ParentInfo focusOn={focusItem} />
    )

  return focusOn && getFocusInfo(focusOn)
}

const TaskInfo = ({ focusOn }: { focusOn: ItemOptionType }) => {
  const showProgress = !!focusOn.duration
  const timeLeft =
    focusOn.duration && focusOn.timeSpent
      ? focusOn.duration - focusOn.timeSpent
      : undefined

  return (
    <View>
      {showProgress && (
        <View>
          <Text>{formatPercentages(focusOn.progress)}</Text>
          <Text>%</Text>
        </View>
      )}
      <View>
        <View>
          <TimerBoldIcon />
          <Text>{formatTimeSpent(focusOn.timeSpent ?? 0)}</Text>
          <Text>spent</Text>
        </View>
        {timeLeft && (
          <View>
            <TimerIcon />
            <Text>{formatTimeSpent(timeLeft)}</Text>
            <Text>left</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const ParentInfo = ({ focusOn }: { focusOn: ItemOptionType }) => {
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
          <Text style={{ fontSize: 48, fontWeight: "700" }}>
            {formatPercentages(focusOn.progress)}
          </Text>
          <Text
            style={{
              fontSize: 42,
              fontWeight: "700",
              textAlignVertical: "bottom",
              marginBottom: 2,
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
              color={Colors.gray[800]}
              style={{ width: 20, height: 20, marginRight: 4 }}
            />
            <Text style={{ marginRight: 4, fontWeight: "700" }}>
              {formatTimeSpent(focusOn.timeSpent)}
            </Text>
            <Text
              style={{ color: Colors.gray[500] }}
            >{`spent${focusOn.containsTasks ? " on tasks" : ""}`}</Text>
          </View>
        )}
        {focusOn?.containsTasks ||
          (focusOn.totalTimeSpent !== undefined && (
            <View style={{ flexDirection: "row" }}>
              <TimerBoldIcon
                color={Colors.gray[800]}
                style={{ width: 20, height: 20, marginRight: 4 }}
              />
              <Text
                style={{
                  marginRight: 4,
                  fontWeight: "700",
                  color: Colors.gray[700],
                }}
              >
                {formatTimeSpent(focusOn.totalTimeSpent)}
              </Text>
              <Text style={{ color: Colors.gray[500] }}>spent in total</Text>
            </View>
          ))}
        {!!timeLeft && (
          <View style={{ flexDirection: "row" }}>
            <TimerIcon
              color={Colors.gray[800]}
              style={{ width: 20, height: 20, marginRight: 4 }}
            />
            <Text
              style={{
                marginRight: 4,
                fontWeight: "700",
                color: Colors.gray[700],
              }}
            >
              {formatTimeSpent(50)}
            </Text>
            <Text
              style={{ color: Colors.gray[500] }}
            >{`left ${focusOn.totalTimeSpent ? "on tasks" : ""}`}</Text>
          </View>
        )}
      </View>
    </View>
  )
}
