import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { ImageBackground, StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { rgbToRGBA } from "@/utils/utils"

import { AnimatedButton } from "../AnimatedButton"
import useTimerStore from "./hooks/useTimer"

export default function TimerActionButtons() {
  const { styles } = useThemeStyles(componentStyles)

  const timerState = useTimerStore.use.timerState()
  const startTimer = useTimerStore.use.startTimer()
  const pauseTimer = useTimerStore.use.pauseTimer()
  const resetTimer = useTimerStore.use.resetTimer()

  return timerState === "idle" ? (
    <AnimatedButton
      key="timer_start"
      style={styles.btn}
      onPress={startTimer}
      entering={FadeIn(0.7)}
      exiting={FadeOut(0.7)}
    >
      <ImageBackground
        source={require("@/assets/images/gradient_animation.gif")}
        style={styles.primaryBtnBackground}
      >
        <View style={styles.primaryBtnFilter} />
        <Text style={styles.primaryBtnText}>Start</Text>
      </ImageBackground>
    </AnimatedButton>
  ) : timerState === "running" ? (
    <AnimatedButton
      key="timer_pause"
      style={[styles.btn, styles.standardBtn]}
      onPress={pauseTimer}
      entering={FadeIn(0.7)}
      exiting={FadeOut(0.7)}
    >
      <Text style={styles.standardBtnText}>Pause</Text>
    </AnimatedButton>
  ) : (
    <View
      key="timer_continue_panel"
      style={{ display: "flex", flexDirection: "row", gap: 10 }}
    >
      <AnimatedButton
        key="timer_continue"
        style={styles.btn}
        onPress={startTimer}
        entering={FadeIn(0.7)}
        exiting={FadeOut(0.7)}
      >
        <ImageBackground
          source={require("@/assets/images/gradient_animation.gif")}
          style={styles.primaryBtnBackground}
        >
          <View style={styles.primaryBtnFilter} />
          <Text style={styles.primaryBtnText}>Continue</Text>
        </ImageBackground>
      </AnimatedButton>

      <AnimatedButton
        key="timer_reset"
        style={[styles.btn, styles.standardBtn]}
        onPress={resetTimer}
        entering={FadeIn(0.7)}
        exiting={FadeOut(0.7)}
      >
        <Text style={styles.standardBtnText}>Stop</Text>
      </AnimatedButton>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    btn: {
      height: 38,
      width: 92,
      borderRadius: 100,
    },
    // Start/Continue button
    primaryBtnText: {
      fontWeight: "600",
      color: isDark ? Colors.gray[50] : "white",
      letterSpacing: 1,
    },
    primaryBtnBackground: {
      borderRadius: 100,
      overflow: "hidden",
      height: 38,
      width: 92,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#ffba95",
    },
    primaryBtnFilter: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "black",
      position: "absolute",
      opacity: isDark ? 0.2 : 0.05,
    },
    // Pause/Stop buttons
    standardBtn: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? Colors.gray[700]
        : rgbToRGBA(Colors.gray[300], 0.2),
      borderWidth: 1,
      borderColor: isDark ? Colors.gray[600] : Colors.gray[400],
    },
    standardBtnText: {
      color: isDark ? Colors.gray[300] : Colors.gray[700],
      letterSpacing: 1,
    },
  })
