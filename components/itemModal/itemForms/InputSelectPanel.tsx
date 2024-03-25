import MinusIcon from "@/assets/icons/minus.svg"
import PlusIcon from "@/assets/icons/plus.svg"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View, ViewStyle } from "react-native"
import { z } from "zod"
import useThemeStyles, {
  NamedStyles,
  ThemeStylesProps,
} from "@/utils/themeStyles"
import { rgbToRGBA } from "@/utils/utils"
import { AnimatedButton } from "@/components/AnimatedButton"

import { taskFormSchema } from "./schemas"

type InputType = keyof z.infer<typeof taskFormSchema>

export default function InputSelectPanel({
  inputOrder,
  setInputOrder,
  wrapperStyles,
}: {
  inputOrder: InputType[]
  setInputOrder: React.Dispatch<React.SetStateAction<InputType[]>>
  wrapperStyles?: ViewStyle
}) {
  const { styles, isDark } = useThemeStyles(componentStyles)

  const addInput = (input: InputType) => setInputOrder(prev => [...prev, input])
  const removeInput = (input: InputType) =>
    setInputOrder(prev => prev.filter(inp => inp !== input))

  const getInput = (input: InputType) => inputOrder.find(inp => inp === input)

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
      <AnimatedButton
        style={[styles.btn, getInput("priority") && styles.btnSelected]}
        onPress={() =>
          getInput("priority") ? removeInput("priority") : addInput("priority")
        }
      >
        <View style={[{ flexDirection: "row", gap: 2, alignItems: "center" }]}>
          <ButtonIcon
            styles={styles}
            isDark={isDark}
            isSelected={!!getInput("priority")}
          />
          <Text style={styles.label}>Priority</Text>
        </View>
      </AnimatedButton>

      <AnimatedButton
        style={[styles.btn, getInput("targetDate") && styles.btnSelected]}
        onPress={() =>
          getInput("targetDate")
            ? removeInput("targetDate")
            : addInput("targetDate")
        }
      >
        <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
          <ButtonIcon
            styles={styles}
            isDark={isDark}
            isSelected={!!getInput("targetDate")}
          />
          <Text style={styles.label}>Target date</Text>
        </View>
      </AnimatedButton>

      <AnimatedButton
        style={[styles.btn, getInput("goal") && styles.btnSelected]}
        onPress={() =>
          getInput("goal") ? removeInput("goal") : addInput("goal")
        }
      >
        <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
          <ButtonIcon
            styles={styles}
            isDark={isDark}
            isSelected={!!getInput("goal")}
          />
          <Text style={styles.label}>Assign goal</Text>
        </View>
      </AnimatedButton>
    </View>
  )
}

function ButtonIcon({
  styles,
  isDark,
  isSelected,
}: {
  styles: NamedStyles<{ icon: unknown }>
  isDark: boolean
  isSelected: boolean
}) {
  return isSelected ? (
    <MinusIcon
      color={isDark ? Colors.gray[300] : Colors.gray[700]}
      style={styles.icon}
      strokeWidth={2}
    />
  ) : (
    <PlusIcon
      color={isDark ? Colors.gray[300] : Colors.gray[700]}
      style={styles.icon}
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
