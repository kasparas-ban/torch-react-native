import React from "react"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import {
  TextInput as BaseInput,
  TextInputProps as BaseTextInputProps,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewProps,
} from "react-native"
import Animated from "react-native-reanimated"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

export type TextInputProps = BaseTextInputProps & {
  label?: string
  wrapperProps?: ViewProps
  labelProps?: TextProps
  errorProps?: TextProps
}

export default function TextInput(props: TextInputProps) {
  const { label, wrapperProps, labelProps, errorProps, ...inputProps } = props
  const { styles, isDark, onFocus, onBlur } = useThemeStyles(inputStyles)
  const isError = !!errorProps?.children

  return (
    <View {...wrapperProps} style={[wrapperProps?.style, styles.wrapper]}>
      {label && (
        <Text
          {...labelProps}
          children={label}
          style={[styles.label, labelProps?.style]}
        />
      )}
      <BaseInput
        {...inputProps}
        placeholderTextColor={isDark ? Colors.gray[400] : Colors.gray[500]}
        style={[styles.input, inputProps.style, isError && styles.errorInput]}
        onFocus={e => {
          onFocus()
          inputProps?.onFocus?.(e)
        }}
        onBlur={e => {
          onBlur()
          inputProps?.onBlur?.(e)
        }}
      />
      {errorProps?.children && (
        <Animated.View style={styles.errorlabel}>
          <Animated.Text
            {...errorProps}
            style={[styles.errorText, errorProps?.style]}
            entering={FadeIn(0.9)}
            exiting={FadeOut(0.9)}
          />
        </Animated.View>
      )}
    </View>
  )
}

const inputStyles = ({ isDark, isFocused, platform }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    input: {
      paddingHorizontal: 16,
      height: 48,
      width: "100%",
      backgroundColor: isDark
        ? "rgba(80, 80, 80, 0.6)"
        : "rgba(20, 15, 38, 0.15)",
      borderRadius: 12,
      color: isDark ? "white" : "black",
      ...(platform === "web"
        ? {
            outlineStyle: isFocused ? "solid" : "none",
            outlineWidth: 2,
            outlineColor: isDark ? Colors.gray[300] : Colors.gray[700],
          }
        : {
            borderWidth: isFocused ? 2 : 0,
            borderColor: isDark ? Colors.gray[300] : Colors.gray[700],
          }),
    },
    errorInput: {
      borderColor: "red",
      borderWidth: 1,
      backgroundColor: isDark ? Colors.rose[200] : Colors.rose[50],
      color: Colors.gray[900],
    },
    label: {
      marginRight: "auto",
      marginLeft: 12,
      marginBottom: 4,
      color: isDark ? Colors.gray[300] : Colors.gray[500],
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
