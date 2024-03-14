import React, { ComponentProps } from "react"
import Colors from "@/constants/Colors"
import { ActivityIndicator, StyleSheet, Text, TextProps } from "react-native"

import { AnimatedButton } from "../AnimatedButton"

type Props = Omit<ComponentProps<typeof AnimatedButton>, "children"> & {
  children: string
  type?: "primary" | "base"
  textProps?: TextProps
  isLoading?: boolean
}

export default function Button(props: Props) {
  const { textProps, isLoading, ...buttonProps } = props
  const buttonStyle = buttonStyles[props.type || "primary"]

  return (
    <AnimatedButton
      {...props}
      style={[
        styles.button,
        buttonStyle,
        buttonProps.style as any,
        isLoading && buttonStyles.loading,
      ]}
    >
      {isLoading && <ActivityIndicator color={Colors.gray[50]} />}
      <Text style={[styles.label, textProps?.style]}>{props.children}</Text>
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
  spinner: {
    color: "red",
  },
})

const buttonStyles = StyleSheet.create({
  base: {},
  primary: {
    height: 48,
    backgroundColor: Colors.rose[500],
  },
  loading: {
    backgroundColor: Colors.rose[300],
  },
})
