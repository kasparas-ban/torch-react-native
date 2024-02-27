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
  type?: "primary"
  textProps?: TextProps
}

export default function Button(props: Props) {
  const { textProps, ...buttonProps } = props
  const buttonStyle = buttonStyles[props.type || "primary"]

  return (
    <Pressable
      {...props}
      style={[styles.button, buttonStyle, buttonProps.style as any]}
    >
      <Text style={[styles.label, textProps?.style]}>{props.children}</Text>
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
  label: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
})

const buttonStyles = StyleSheet.create({
  primary: {
    height: 48,
    backgroundColor: Colors.rose[500],
  },
})
