import Colors from "@/constants/Colors"
import useWs from "@/stores/websocketStore"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

export default function WebSocketStatusTag() {
  const { styles } = useThemeStyles(componentStyles)
  const { ws } = useWs()

  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Text style={styles.text}>Connected</Text>
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    text: {
      fontSize: 12,
      color: isDark ? Colors.green[300] : Colors.green[600],
      letterSpacing: 1,
    },
  })
