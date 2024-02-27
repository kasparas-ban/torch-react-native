import React from "react"
import Colors from "@/constants/Colors"
import { PressableProps, StyleSheet, Text, TextProps } from "react-native"

import { AnimatedButton } from "../AnimatedButton"

type Props = Omit<PressableProps, "children"> & {
  children: string
  textProps?: TextProps
}

export default function Link(props: Props) {
  const { textProps, children, ...pressableProps } = props

  return (
    <AnimatedButton scale={0.98} style={[pressableProps.style as any]}>
      <Text style={[styles.text, textProps?.style]}>{children}</Text>
    </AnimatedButton>
  )
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.rose[500],
    fontWeight: "600",
  },
})
