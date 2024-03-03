import React from "react"
import Colors from "@/constants/Colors"
import { Link as BaseLink, Href } from "expo-router"
import { PressableProps, StyleSheet, Text, TextProps } from "react-native"

import { AnimatedButton } from "../AnimatedButton"

type Props<T> = Omit<PressableProps, "children"> & {
  children: string
  href: Href<T>
  textProps?: TextProps
}

export default function Link<T>(props: Props<T>) {
  const { textProps, children, ...pressableProps } = props

  return (
    <BaseLink href={props.href} style={[pressableProps.style as any]} asChild>
      <AnimatedButton scale={0.98}>
        <Text style={[styles.text, textProps?.style]}>{children}</Text>
      </AnimatedButton>
    </BaseLink>
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
