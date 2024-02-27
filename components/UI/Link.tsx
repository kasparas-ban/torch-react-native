import React from "react"
import Colors from "@/constants/Colors"
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextProps,
} from "react-native"

type Props = Omit<PressableProps, "children"> & {
  children: string
  textProps?: TextProps
}

export default function Link(props: Props) {
  const { textProps, children, ...pressableProps } = props

  return (
    <Pressable style={[pressableProps.style as any]}>
      <Text style={[styles.text, textProps?.style]}>{children}</Text>
    </Pressable>
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
  },
})
