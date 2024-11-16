import MinusIcon from "@/assets/icons/minus.svg"
import PlusIcon from "@/assets/icons/plus.svg"
import Colors from "@/constants/Colors"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { z } from "zod"
import { SelectOption } from "@/types/generalTypes"
import useThemeStyles, {
  NamedStyles,
  ThemeStylesProps,
} from "@/utils/themeStyles"
import { rgbToRGBA } from "@/utils/utils"
import { AnimatedButton } from "@/components/AnimatedButton"

import { dreamFormSchema, goalFormSchema, taskFormSchema } from "./schemas"

type TaskInputType = keyof z.infer<typeof taskFormSchema>
type GoalInputType = keyof z.infer<typeof goalFormSchema>
type DreamInputType = keyof z.infer<typeof dreamFormSchema>

type InputType = TaskInputType | GoalInputType | DreamInputType

export default function InputSelectPanel<T extends InputType>({
  inputNames,
  inputOrder,
  setInputOrder,
  wrapperStyles,
}: {
  inputNames: SelectOption<T>[]
  inputOrder: T[]
  setInputOrder: React.Dispatch<React.SetStateAction<T[]>>
  wrapperStyles?: ViewStyle
}) {
  const { styles, isDark } = useThemeStyles(componentStyles)

  const addInput = (input: T) => setInputOrder(prev => [...prev, input])
  const removeInput = (input: T) =>
    setInputOrder(prev => prev.filter(inp => inp !== input))

  const getInput = (input: T) => inputOrder.find(inp => inp === input)

  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 10,
          width: 300,
        },
        wrapperStyles,
      ]}
    >
      {inputNames.map(input => (
        <AnimatedButton
          key={input.value}
          style={[styles.btn, getInput(input.value) && styles.btnSelected]}
          onPress={() =>
            getInput(input.value)
              ? removeInput(input.value)
              : addInput(input.value)
          }
        >
          <View
            style={[{ flexDirection: "row", gap: 2, alignItems: "center" }]}
          >
            <ButtonIcon
              styles={styles.icon}
              isDark={isDark}
              isSelected={!!getInput(input.value)}
            />
            <Text style={styles.label}>{input.label}</Text>
          </View>
        </AnimatedButton>
      ))}
    </View>
  )
}

function ButtonIcon({
  styles,
  isDark,
  isSelected,
}: {
  styles: StyleProp<ViewStyle>
  isDark: boolean
  isSelected: boolean
}) {
  return isSelected ? (
    <MinusIcon
      color={isDark ? Colors.gray[300] : Colors.gray[700]}
      style={styles}
      strokeWidth={2}
    />
  ) : (
    <PlusIcon
      color={isDark ? Colors.gray[300] : Colors.gray[700]}
      style={styles}
      strokeWidth={2}
    />
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    btn: {
      backgroundColor: isDark ? Colors.gray[600] : Colors.gray[200],
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: isDark ? Colors.gray[500] : rgbToRGBA(Colors.gray[300], 0.8),
    },
    btnSelected: {
      backgroundColor: isDark ? Colors.gray[800] : Colors.gray[300],
      borderColor: isDark ? Colors.gray[600] : Colors.gray[400],
    },
    label: {
      fontSize: 15,
      color: isDark ? Colors.gray[300] : Colors.gray[700],
    },
    icon: {
      width: 16,
      height: 16,
    },
  })
