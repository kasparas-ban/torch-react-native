import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import useTimerStore, { useTimerListener } from "./hooks/useTimer"
import TimerActionButtons from "./TimerActionButtons"
import TimerSettingsButton from "./TimerSettingsButton"
import TimerShape from "./TimerShape"

export default function TimerClock() {
  useTimerListener()

  const { styles } = useThemeStyles(componentStyles)

  const time = useTimerStore.use.time()
  const initialTimerTime = useTimerStore.use.initialTime()
  const isBreakActive = useTimerStore.use.break()
  const isLongBreakActive = useTimerStore.use.timerCount() >= 4
  const longBreakTime = useTimerStore.use.longBreakTime()
  const breakTime = useTimerStore.use.breakTime()
  const initialTime = isBreakActive
    ? isLongBreakActive
      ? longBreakTime
      : breakTime
    : initialTimerTime

  const minutes = Math.floor(time / 60)
  const seconds = time - minutes * 60

  return (
    <View>
      <TimerShape
        initialTime={initialTime}
        currentTime={time}
        isBreakActive={isBreakActive}
      >
        <Text style={styles.timerText}>
          {`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`}
        </Text>

        <View
          style={{
            position: "absolute",
            bottom: 40,
            width: "100%",
            zIndex: 1,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <TimerSettingsButton />
          </View>
        </View>
      </TimerShape>

      <View style={{ display: "flex", alignItems: "center", marginTop: 32 }}>
        <TimerActionButtons key="timer_action_buttons" />
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    timerText: {
      fontSize: 92,
      fontWeight: "300",
      fontVariant: ["tabular-nums"],
      color: isDark ? Colors.gray[50] : Colors.gray[700],
      position: "absolute",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      alignContent: "center",
      margin: "auto",
      alignSelf: "center",
      textAlign: "center",
      textAlignVertical: "center",
    },
  })
