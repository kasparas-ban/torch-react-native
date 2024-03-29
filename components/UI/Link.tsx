import React, { ReactNode } from "react"
import Colors from "@/constants/Colors"
import { Link as BaseLink, Href, LinkProps } from "expo-router"
import { PressableProps, StyleSheet, Text, TextProps } from "react-native"
import { AnimatedProps } from "react-native-reanimated"

import { AnimatedButton } from "../AnimatedButton"

type Props<T> = AnimatedProps<LinkProps<T>> &
  Omit<PressableProps, "children"> & {
    children: ReactNode
    href: Href<T>
    scale?: number
    textProps?: TextProps
  }

export default function Link<T>(props: Props<T>) {
  const { textProps, scale, children, ...pressableProps } = props

  return (
    <BaseLink href={props.href} style={[pressableProps.style as any]} asChild>
      <AnimatedButton
        scale={scale || 0.98}
        entering={props.entering}
        exiting={props.exiting}
      >
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
