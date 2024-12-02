import Colors from "@/constants/Colors"
import useWs from "@/stores/websocketStore"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

export default function WebSocketStatusTag() {
  const { styles } = useThemeStyles(componentStyles)
  const { ws } = useWs()

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Text style={styles.text}>{ws ? "Data sync" : "Disconnected"}</Text>
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 100,
          marginTop: 1,
          ...(ws ? styles.activeBubbleBg : styles.inactiveBubbleBg),
        }}
      />
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    text: {
      fontSize: 12,
      color: isDark ? Colors.gray[400] : Colors.gray[500],
      letterSpacing: 1,
    },
    activeBubbleBg: {
      backgroundColor: isDark ? Colors.green[400] : Colors.green[300],
    },
    inactiveBubbleBg: {
      backgroundColor: isDark ? Colors.red[500] : Colors.red[400],
      opacity: 0.9,
    },
  })
