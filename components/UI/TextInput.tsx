import React from "react"
import Colors from "@/constants/Colors"
import { BlurView } from "expo-blur"
import {
  TextInput as BaseInput,
  StyleSheet,
  Text,
  TextInputProps,
  TextProps,
  View,
  ViewProps,
} from "react-native"

type Props = TextInputProps & {
  wrapperProps?: ViewProps
  labelProps?: TextProps
  errorProps?: TextProps
}

export default function TextInput(props: Props) {
  const { wrapperProps, labelProps, errorProps, ...inputProps } = props
  const isError = !!errorProps?.children

  return (
    <View {...wrapperProps} style={[wrapperProps?.style || styles.wrapper]}>
      {labelProps?.children && (
        <Text {...labelProps} style={[styles.label, labelProps?.style]} />
      )}
      <BlurView
        style={styles.blur}
        intensity={30}
        experimentalBlurMethod="none"
      >
        <BaseInput
          {...inputProps}
          style={[styles.input, inputProps.style, isError && styles.errorInput]}
        />
      </BlurView>
      {errorProps?.children && (
        <Text {...errorProps} style={[styles.errorlabel, errorProps?.style]} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: 24,
    maxWidth: 400,
  },
  blur: {
    borderRadius: 12,
  },
  input: {
    paddingHorizontal: 16,
    height: 48,
    width: "100%",
    backgroundColor: "rgba(20, 15, 38, 0.2)",
    borderRadius: 12,
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
    backgroundColor: Colors.rose[50],
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
