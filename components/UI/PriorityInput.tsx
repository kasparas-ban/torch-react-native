import { useEffect } from "react"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, TextProps, View, ViewProps } from "react-native"
import { ItemResponse } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"

type InputProps = {
  value?: ItemResponse["priority"] | null
  onChange: (val: ItemResponse["priority"]) => void
  label?: string
  title?: string
  wrapperProps?: ViewProps
  labelProps?: TextProps
}

export default function PriorityInput(props: InputProps) {
  const { value, onChange, label, labelProps, wrapperProps } = props
  const { styles } = useThemeStyles(componentStyles)

  useEffect(() => {
    if (!value) onChange("MEDIUM")
  }, [])

  return (
    <View {...wrapperProps} style={[wrapperProps?.style, styles.wrapper]}>
      {label && (
        <Text
          {...labelProps}
          children={label}
          style={[styles.label, labelProps?.style]}
        />
      )}

      <View style={styles.inputWrapper}>
        <AnimatedButton
          style={styles.inputBtn}
          scale={0.96}
          onPress={() => onChange("LOW")}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.option,
                pressed && styles.inputActive,
                value === "LOW" && styles.inputSelected,
              ]}
            >
              Low
            </Text>
          )}
        </AnimatedButton>
        <AnimatedButton
          style={styles.inputBtn}
          scale={0.96}
          onPress={() => onChange("MEDIUM")}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.option,
                pressed && styles.inputActive,
                value === "MEDIUM" && styles.inputSelected,
              ]}
            >
              Medium
            </Text>
          )}
        </AnimatedButton>
        <AnimatedButton
          style={styles.inputBtn}
          scale={0.96}
          onPress={() => onChange("HIGH")}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.option,
                pressed && styles.inputActive,
                value === "HIGH" && styles.inputSelected,
              ]}
            >
              High
            </Text>
          )}
        </AnimatedButton>
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    label: {
      flexDirection: "row",
      marginLeft: 12,
      marginBottom: 4,
      color: isDark ? Colors.gray[300] : Colors.gray[500],
    },
    inputWrapper: {
      flexDirection: "row",
      width: "100%",
      display: "flex",
      height: 48,
      gap: 4,
      backgroundColor: isDark
        ? "rgba(80, 80, 80, 0.6)"
        : "rgba(20, 15, 38, 0.15)",
      borderRadius: 12,
      padding: 4,
    },
    inputBtn: {
      flex: 1,
      borderRadius: 8,
      alignItems: "center",
    },
    inputSelected: {
      backgroundColor: isDark ? Colors.gray[300] : Colors.gray[100],
      color: Colors.gray[700],
    },
    inputActive: {
      backgroundColor: isDark ? Colors.gray[500] : Colors.gray[200],
    },
    option: {
      borderRadius: 8,
      textAlignVertical: "center",
      textAlign: "center",
      height: "100%",
      width: "100%",
      color: isDark ? Colors.gray[300] : Colors.gray[500],
      fontWeight: "600",
    },
  })
