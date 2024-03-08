import SettingsIcon from "@/assets/icons/settings.svg"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import Link from "../UI/Link"
import useTimerStore from "./hooks/useTimer"

export default function TimerSettingsButton() {
  const { styles } = useThemeStyles(componentStyles)

  const timerState = useTimerStore.use.timerState()

  return (
    <View style={{ width: 92, height: 38 }}>
      {timerState !== "running" ? (
        <Link
          href="/(modals)/timer-settings"
          entering={FadeIn(0.9)}
          exiting={FadeOut(0.9)}
          style={styles.btn}
        >
          <View
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <SettingsIcon style={styles.btnIcon} />
            <Text style={styles.btnText}>Settings</Text>
          </View>
        </Link>
      ) : null}
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    btn: {
      height: 38,
      width: 92,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    btnText: {
      color: isDark ? Colors.gray[300] : Colors.gray[700],
      letterSpacing: 1,
    },
    btnIcon: {
      width: 16,
      height: 16,
      color: isDark ? Colors.gray[300] : Colors.gray[700],
    },
  })
