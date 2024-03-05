import React from "react"
import Colors from "@/constants/Colors"
import {
  TextInput as BaseInput,
  StyleSheet,
  Text,
  TextInputProps,
  TextProps,
  View,
  ViewProps,
} from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

type Props = TextInputProps & {
  wrapperProps?: ViewProps
  labelProps?: TextProps
  errorProps?: TextProps
}

export default function TextInput(props: Props) {
  const { wrapperProps, labelProps, errorProps, ...inputProps } = props
  const { styles, onFocus, onBlur } = useThemeStyles(inputStyles)
  const isError = !!errorProps?.children

  return (
    <View {...wrapperProps} style={[wrapperProps?.style, styles.wrapper]}>
      {labelProps?.children && (
        <Text {...labelProps} style={[styles.label, labelProps?.style]} />
      )}
      <BaseInput
        {...inputProps}
        placeholderTextColor={Colors.gray[500]}
        style={[styles.input, inputProps.style, isError && styles.errorInput]}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {errorProps?.children && (
        <Text {...errorProps} style={[styles.errorlabel, errorProps?.style]} />
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
    },
    label: {
      paddingLeft: 8,
      marginBottom: 4,
    },
    errorlabel: {
      marginTop: 4,
      paddingLeft: 8,
      color: Colors.rose[600],
    },
  })
