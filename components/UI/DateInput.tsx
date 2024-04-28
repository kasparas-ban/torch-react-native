import CloseIcon from "@/assets/icons/close.svg"
import { FadeIn } from "@/constants/Animations"
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
import Animated from "react-native-reanimated"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"

export type DateInputProps = {
  value?: Date
  onChange: (date?: string | null) => void
  placeholder: string
  label?: string
  wrapperProps?: ViewProps
  labelProps?: TextProps
  errorProps?: TextProps
  minDate?: Date
  maxDate?: Date
}

export default function DateInput(props: DateInputProps) {
  const {
    placeholder,
    value,
    onChange,
    label,
    labelProps,
    wrapperProps,
    errorProps,
    minDate,
    maxDate
  } = props

  const { styles, isDark } = useThemeStyles(inputStyles)

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    onChange(selectedDate?.toLocaleDateString("en-CA") || null)
  }

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: value || new Date(),
      onChange: handleChange,
      mode: "date",
      is24Hour: true,
      minimumDate: minDate,
      maximumDate: maxDate
    })
  }

  return (
    <View {...wrapperProps} style={[wrapperProps?.style, styles.wrapper]}>
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
          onPress={() => onChange(null)}
        >
          <CloseIcon
            color={isDark ? Colors.gray[400] : Colors.gray[600]}
            style={styles.closeIcon}
          />
        </AnimatedButton>
      )}
      {errorProps?.children && (
        <Animated.View style={styles.errorlabel}>
          <Animated.Text
            {...errorProps}
            style={[styles.errorText, errorProps?.style]}
            entering={FadeIn(0.9)}
          />
        </Animated.View>
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
      color: isDark ? Colors.gray[300] : Colors.gray[500],
    },
    placeholder: {
      paddingHorizontal: 16,
      borderRadius: 12,
      textAlignVertical: "center",
      height: "100%",
      color: isDark ? Colors.gray[400] : Colors.gray[500],
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
    errorlabel: {
      marginTop: 4,
      paddingLeft: 12,
      alignSelf: "flex-start",
    },
    errorText: {
      color: Colors.rose[600],
    },
  })
