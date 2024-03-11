import { useItemsList } from "@/api-endpoints/hooks/items/useItemsList"
import { getItemsByType } from "@/api-endpoints/utils/helpers"
import Colors from "@/constants/Colors"
import { Picker } from "@react-native-picker/picker"
import { StyleSheet, View } from "react-native"
import { ItemType } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import CloseIcon from "../../assets/icons/close.svg"
import { AnimatedButton } from "../AnimatedButton"
import useTimerStore from "./hooks/useTimer"
import useTimerForm from "./hooks/useTimerForm"

const EMPTY_OPTION = {
  value: "empty",
  label: "No tasks/goals/dreams found",
  type: "TASK" as ItemType,
  containsTasks: false,
}

export default function FocusInput() {
  const timerState = useTimerStore.use.timerState()
  const { focusOn, setFocusOn, focusType, setFocusType } = useTimerForm()
  const { data } = useItemsList()

  const { styles } = useThemeStyles(componentStyles)

  const options = getItemsByType({
    itemData: data,
    focusType,
    grouped: focusType === "TASKS" || focusType === "GOALS",
  })

  const isEmpty = !options.length

  console.log(focusOn)

  return (
    <View>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={isEmpty ? EMPTY_OPTION : focusOn}
          onValueChange={option => setFocusOn(option)}
          enabled={!isEmpty}
          style={isEmpty ? styles.pickerEmpty : {}}
        >
          <Picker.Item label={"Select..."} value={undefined} />
          {options.map(option => (
            <Picker.Item label={option.label} value={option.value} />
          ))}
          {isEmpty && (
            <Picker.Item
              label={EMPTY_OPTION.label}
              value={EMPTY_OPTION.value}
            />
          )}
        </Picker>

        <View style={styles.closeIconWrapper}>
          {focusOn && (
            <AnimatedButton
              style={{ height: "100%" }}
              onPress={() => setFocusOn(null)}
            >
              <CloseIcon style={styles.closeIcon} />
            </AnimatedButton>
          )}
        </View>
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    pickerWrapper: {
      backgroundColor: Colors.gray[200],
      borderRadius: 18,
      width: "100%",
    },
    pickerEmpty: {
      color: Colors.gray[500],
      fontStyle: "italic",
    },
    closeIconWrapper: {
      position: "absolute",
      backgroundColor: Colors.gray[200],
      right: 0,
      height: 53,
      width: 53,
      borderTopRightRadius: 18,
      borderBottomRightRadius: 18,
      display: "flex",
    },
    closeIcon: {
      color: Colors.gray[600],
      backgroundColor: Colors.gray[200],
      width: 24,
      height: 24,
      top: 16,
      left: 14,
    },
  })
