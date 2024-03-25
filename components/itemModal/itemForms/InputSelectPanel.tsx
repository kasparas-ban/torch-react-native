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
  const { styles } = useThemeStyles(componentStyles)

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
          <ButtonIcon styles={styles} isSelected={!!getInput("priority")} />
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
          <ButtonIcon styles={styles} isSelected={!!getInput("targetDate")} />
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
          <ButtonIcon styles={styles} isSelected={!!getInput("goal")} />
          <Text style={styles.label}>Assign goal</Text>
        </View>
      </AnimatedButton>
    </View>
  )
}

function ButtonIcon({
  styles,
  isSelected,
}: {
  styles: NamedStyles<{ icon: unknown }>
  isSelected: boolean
}) {
  return isSelected ? (
    <MinusIcon color={Colors.gray[700]} style={styles.icon} strokeWidth={3} />
  ) : (
    <PlusIcon color={Colors.gray[700]} style={styles.icon} strokeWidth={3} />
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    btn: {
      backgroundColor: Colors.gray[200],
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: rgbToRGBA(Colors.gray[300], 0.8),
    },
    btnSelected: {
      backgroundColor: Colors.gray[400],
      borderColor: Colors.gray[500],
    },
    label: {
      fontSize: 16,
      color: Colors.gray[700],
      fontWeight: "600",
    },
    icon: {
      width: 16,
      height: 16,
    },
  })
