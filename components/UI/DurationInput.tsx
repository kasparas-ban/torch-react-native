import { useState } from "react"
import CloseIcon from "@/assets/icons/close.svg"
import Colors from "@/constants/Colors"
import { LinearGradient } from "expo-linear-gradient"
import {
  Pressable,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewProps,
} from "react-native"
import { TimerPickerModal } from "react-native-timer-picker"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { formatSpentTime } from "@/utils/utils"

import { AnimatedButton } from "../AnimatedButton"

type InputProps = {
  value?: number | null
  onChange: (val?: number | null) => void
  placeholder: string
  label?: string
  title?: string
  wrapperProps?: ViewProps
  labelProps?: TextProps
  errorProps?: TextProps
}

export default function DurationInput(props: InputProps) {
  const { placeholder, value, onChange, label, labelProps, wrapperProps } =
    props
  const { styles, isDark } = useThemeStyles(selectStyles)

  const [showPicker, setShowPicker] = useState(false)

  return (
    <View {...wrapperProps} style={[wrapperProps?.style, styles.wrapper]}>
      {label && (
        <View style={{ flexDirection: "row", marginLeft: 12, marginBottom: 4 }}>
          <Text
            {...labelProps}
            children={label}
            style={[styles.label, labelProps?.style]}
          />
          <Text style={styles.infoLabel}>(Used to track your progress)</Text>
        </View>
      )}

      <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
        {({ pressed }) => (
          <Text
            style={[
              styles.placeholder,
              pressed && styles.inputActive,
              !!value && styles.inputValue,
            ]}
          >
            {value ? formatSpentTime(value) : placeholder}
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

      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        onConfirm={pickedDuration => {
          onChange(pickedDuration.hours * 60 * 60 + pickedDuration.minutes * 60)
          setShowPicker(false)
        }}
        modalTitle="Task duration"
        minuteLabel="min"
        hourLabel="h"
        hideSeconds
        onCancel={() => setShowPicker(false)}
        closeOnOverlayPress
        LinearGradient={LinearGradient}
        topPickerGradientOverlayProps={{
          colors: [isDark ? Colors.gray[700] : "white", "transparent"],
        }}
        bottomPickerGradientOverlayProps={{
          colors: ["transparent", isDark ? Colors.gray[700] : "white"],
        }}
        initialValue={{
          hours: value ? Math.floor(value / 3600) : 0,
          minutes: value ? Math.floor((value % 3600) / 60) : 0,
        }}
        styles={{
          contentContainer: {
            backgroundColor: isDark ? Colors.gray[700] : "white",
            ...(isDark && { borderWidth: 1, borderColor: Colors.gray[500] }),
          },
          pickerContainer: {
            backgroundColor: isDark ? Colors.gray[700] : "white",
          },
          pickerItem: {
            fontSize: 34,
            fontWeight: "700",
            color: isDark ? Colors.gray[300] : Colors.gray[700],
          },
          modalTitle: {
            color: isDark ? Colors.gray[300] : Colors.gray[800],
          },
          cancelButton: {
            borderWidth: 0,
            color: isDark ? Colors.gray[300] : Colors.gray[800],
          },
          confirmButton: {
            borderWidth: 0,
            backgroundColor: Colors.rose[500],
            color: "white",
          },
          pickerLabel: {
            fontSize: 24,
            right: -40,
            color: isDark ? Colors.gray[400] : Colors.gray[700],
          },
          pickerLabelContainer: {
            width: 48,
          },
          pickerItemContainer: {
            width: 80,
          },
        }}
      />
    </View>
  )
}

const selectStyles = ({ isDark }: ThemeStylesProps) =>
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
      color: isDark ? Colors.gray[300] : Colors.gray[500],
    },
    infoLabel: {
      marginLeft: 6,
      color: isDark ? Colors.gray[400] : Colors.gray[400],
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
  })
