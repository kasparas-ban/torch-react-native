import { ReactNode } from "react"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import useGlobalLoading from "./useGlobalLoading"

export default function GlobalLoadingScreen({
  children,
}: {
  children: ReactNode
}) {
  const { styles } = useThemeStyles(componentStyles)
  const { isGlobalLoading } = useGlobalLoading()

  return (
    <>
      {children}
      {isGlobalLoading && (
        <Animated.View
          style={styles.background}
          entering={FadeIn(1, 0.9)}
          exiting={FadeOut(1)}
        >
          <View style={styles.wrapper}>
            <ActivityIndicator size="large" color={Colors.rose[500]} />
            <Text style={styles.loadingText}>Logging out...</Text>
          </View>
        </Animated.View>
      )}
    </>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: "center",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: isDark ? Colors.gray[800] : "white",
    },
    wrapper: {
      flexDirection: "row",
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
    },
    loadingText: {
      textAlign: "center",
      fontSize: 20,
      fontWeight: "600",
      color: isDark ? Colors.gray[100] : Colors.gray[800],
    },
  })
