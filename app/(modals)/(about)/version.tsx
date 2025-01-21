import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

export default function Version() {
  const { styles } = useThemeStyles(componentStyles)

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 40, marginLeft: 30, position: "absolute" }}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 12,
            marginTop: 50,
            zIndex: 1,
          }}
        >
          <Text style={styles.title}>Version</Text>
        </View>
      </View>
      <View
        style={{ paddingHorizontal: 42, paddingBottom: 100, marginTop: 170 }}
      >
        <Text style={styles.infoText}>Current version: 1.0</Text>
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    title: {
      color: isDark ? Colors.gray[300] : Colors.gray[400],
      fontFamily: "GabaritoSemibold",
      fontSize: 46,
    },
    infoText: {
      color: isDark ? Colors.gray[400] : Colors.gray[700],
    },
  })
