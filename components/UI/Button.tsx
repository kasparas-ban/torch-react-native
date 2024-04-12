import React, { ComponentProps } from "react"
import Colors from "@/constants/Colors"
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextProps,
  View,
} from "react-native"

import { AnimatedButton } from "../AnimatedButton"

type Props = Omit<ComponentProps<typeof AnimatedButton>, "children"> & {
  children: string
  type?: "primary" | "base"
  textProps?: TextProps
  isLoading?: boolean
  isDisabled?: boolean
}

export default function Button(props: Props) {
  const { textProps, isLoading, isDisabled, ...buttonProps } = props
  const buttonStyle = buttonStyles[props.type || "primary"]

  return (
    <AnimatedButton
      {...props}
      style={[
        styles.button,
        buttonStyle,
        buttonProps.style,
        (isLoading || isDisabled) && buttonStyles.disabled,
      ]}
      disabled={isLoading || isDisabled}
    >
      <View style={{ flexDirection: "row", gap: 8 }}>
        {isLoading && <ActivityIndicator color={Colors.gray[50]} />}
        <Text style={[styles.label, textProps?.style]}>{props.children}</Text>
      </View>
    </AnimatedButton>
  )
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
})

const buttonStyles = StyleSheet.create({
  base: {},
  primary: {
    height: 48,
    backgroundColor: Colors.rose[500],
  },
  disabled: {
    backgroundColor: Colors.rose[300],
  },
})
