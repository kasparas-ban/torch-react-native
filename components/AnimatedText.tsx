import React from "react"
import { TextFlipEnter, TextFlipExit } from "@/constants/Animations"
import { TextProps } from "react-native"
import Animated from "react-native-reanimated"

export function AnimatedText(props: TextProps) {
  return (
    <Animated.Text
      key={props.children?.toString()}
      {...props}
      entering={TextFlipEnter}
      exiting={TextFlipExit}
    />
  )
}
