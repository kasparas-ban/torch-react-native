import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import { SelectOption } from "@/types/generalTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"

export default function ToggleGroup<T>({
  title,
  options,
  selected,
  onChange,
}: {
  title?: string
  options: SelectOption<T>[]
  selected?: T
  onChange: (val: T) => void
}) {
  const { styles } = useThemeStyles(groupStyles)
  const selectedValue = selected || options[0].value

  return (
    <View style={styles.wrapper}>
      {title && <Text style={styles.title}>{title}</Text>}
      {options.map((option, idx) => (
        <AnimatedButton
          key={idx}
          style={[
            styles.optionWrapper,
            selectedValue === option.value && styles.activeOption,
          ]}
          onPress={() => onChange(option.value)}
          scale={0.99}
        >
          <Text
            style={[
              styles.optionLabel,
              selectedValue === option.value && styles.activeLabel,
            ]}
          >
            {option.label}
          </Text>
        </AnimatedButton>
      ))}
    </View>
  )
}

const groupStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      paddingHorizontal: 24,
      gap: 6,
    },
    optionWrapper: {
      height: 44,
      width: "100%",
      backgroundColor: isDark ? Colors.gray[700] : Colors.gray[100],
      borderRadius: 8,
      display: "flex",
      justifyContent: "center",
    },
    optionLabel: {
      marginLeft: 20,
      color: isDark ? Colors.gray[400] : Colors.gray[700],
      fontWeight: "500",
    },
    activeOption: {
      backgroundColor: isDark ? Colors.rose[500] : Colors.rose[400],
      borderWidth: 1,
      borderColor: isDark ? Colors.rose[500] : Colors.rose[300],
    },
    activeLabel: {
      color: Colors.gray[50],
    },
    title: {
      color: isDark ? Colors.gray[400] : Colors.gray[600],
      height: 32,
      fontSize: 20,
      fontWeight: "700",
    },
  })
