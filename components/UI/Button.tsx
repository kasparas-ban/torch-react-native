import React from "react"
import Colors from "@/constants/Colors"
import { BlurView } from "expo-blur"
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from "react-native"

type Props = Omit<PressableProps, "children"> & {
  children: string
  type?: "primary"
  wrapperProps?: ViewProps
}

export default function Button(props: Props) {
  const { wrapperProps, ...pressableProps } = props

  const buttonStyle = buttonStyles[props.type || "primary"]

  return (
    <View {...wrapperProps} style={[wrapperProps?.style || styles.wrapper]}>
      <BlurView
        style={styles.blur}
        intensity={30}
        experimentalBlurMethod="none"
      >
        <Pressable {...pressableProps} style={[styles.button, buttonStyle]}>
          <Text style={styles.label}>{pressableProps.children}</Text>
        </Pressable>
      </BlurView>
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
  button: {
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
