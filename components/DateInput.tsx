import CloseIcon from "@/assets/icons/close.svg"
import Colors from "@/constants/Colors"
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker"
import dayjs from "dayjs"
import {
  Pressable,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewProps,
} from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "./AnimatedButton"

export type TextInputProps = {
  value?: Date
  onChange: (event: DateTimePickerEvent, date?: Date | undefined) => void
  placeholder: string
  label?: string
  wrapperProps?: ViewProps
  labelProps?: TextProps
  errorProps?: TextProps
}

export default function DateInput(props: TextInputProps) {
  const { placeholder, value, onChange, label, labelProps } = props

  const { styles } = useThemeStyles(inputStyles)

  const handleChange = (event: DateTimePickerEvent, selectedDate: any) => {
    onChange(selectedDate)
  }

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: value || new Date(),
      onChange: handleChange,
      mode: "date",
      is24Hour: true,
    })
  }

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text
          {...labelProps}
          children={label}
          style={[styles.label, labelProps?.style]}
        />
      )}
      <Pressable style={styles.input} onPress={openDatePicker}>
        {({ pressed }) => (
          <Text
            style={[
              styles.placeholder,
              pressed && styles.inputActive,
              value && styles.inputValue,
            ]}
          >
            {value ? dayjs(value).format("YYYY/MM/DD") : placeholder}
          </Text>
        )}
      </Pressable>
      {value && (
        <AnimatedButton
          style={styles.iconWrapper}
          onPress={e => onChange(e as any, undefined)}
        >
          <CloseIcon color={Colors.gray[600]} style={styles.closeIcon} />
        </AnimatedButton>
      )}
    </View>
  )
}

const inputStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    input: {
      position: "relative",
      display: "flex",
      height: 48,
      width: "100%",
      backgroundColor: isDark
        ? "rgba(80, 80, 80, 0.6)"
        : "rgba(20, 15, 38, 0.15)",
      borderRadius: 12,
    },
    inputActive: {
      borderWidth: 2,
      borderColor: isDark ? Colors.gray[300] : Colors.gray[700],
    },
    inputValue: {
      color: isDark ? "white" : "black",
    },
    label: {
      marginLeft: 12,
      marginBottom: 4,
      color: Colors.gray[500],
    },
    placeholder: {
      paddingHorizontal: 16,
      borderRadius: 12,
      textAlignVertical: "center",
      height: "100%",
      color: Colors.gray[500],
    },
    iconWrapper: {
      position: "absolute",
      marginTop: 23,
      borderBottomEndRadius: 14,
      borderTopEndRadius: 14,
      right: 0,
      height: 48,
      width: 42,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    closeIcon: {
      width: 20,
      height: 20,
    },
  })
