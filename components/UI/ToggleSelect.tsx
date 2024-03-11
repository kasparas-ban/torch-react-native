import React from "react"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"

type ToggleSelectProps<T extends string> = {
  options: Option<T>[]
  selected: string
  onChange: (option: Option<T>) => void
}

type Option<T extends string> = { label: string; value: T }

export default function ToggleSelect<T extends string>(
  props: ToggleSelectProps<T>
) {
  const { options, selected, onChange } = props
  const { styles } = useThemeStyles(componentStyles)

  return (
    <View style={styles.wrapper}>
      {options.map(option => (
        <AnimatedButton
          key={option.value}
          style={[
            styles.item,
            option.value === selected && styles.selectedItem,
          ]}
          onPress={() => onChange(option)}
        >
          <Text
            style={[
              styles.itemText,
              option.value === selected && styles.selectedText,
            ]}
          >
            {option.label}
          </Text>
        </AnimatedButton>
      ))}
    </View>
  )
}

const componentStyles = ({ isDark, isFocused, platform }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
      flexDirection: "row",
      borderRadius: 16,
      backgroundColor: isDark ? Colors.gray[600] : Colors.gray[200],
    },
    item: {
      width: "100%",
      flexShrink: 1,
      height: 38,
      borderRadius: 12,
      justifyContent: "center",
      margin: 4,
    },
    selectedItem: {
      backgroundColor: isDark ? Colors.gray[300] : Colors.gray[50],
    },
    itemText: {
      textAlign: "center",
      fontSize: 16,
      color: isDark ? Colors.gray[400] : Colors.gray[500],
      fontWeight: "600",
    },
    selectedText: {
      color: Colors.gray[700],
    },
  })
