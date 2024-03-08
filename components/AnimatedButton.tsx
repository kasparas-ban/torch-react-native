import React, { forwardRef, Ref } from "react"
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  View,
} from "react-native"
import Animated, {
  AnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const DEFAULT_SCALE = 0.92
const DEFAULT_OPACITY = 0.7

type Props = AnimatedProps<PressableProps> &
  PressableProps & {
    scale?: number
    opacity?: number
  }

function AnimatedButtonBase(props: Props, ref: Ref<View>) {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  const handlePressIn = () => {
    scale.value = withTiming(props.scale || DEFAULT_SCALE, {
      duration: 100,
    })
    opacity.value = withTiming(props.opacity || DEFAULT_OPACITY, {
      duration: 100,
    })
  }

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 100,
    })
    opacity.value = withTiming(1, {
      duration: 100,
    })
  }

  const handlePress = (e: GestureResponderEvent) => {
    scale.value = withSequence(
      withTiming(props.scale || DEFAULT_SCALE, {
        duration: 100,
      }),
      withTiming(1, {
        duration: 100,
      })
    )
    props.onPress?.(e)
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }
  })

  return (
    <AnimatedPressable
      ref={ref}
      key={props.children?.toString()}
      {...props}
      style={[props.style, animatedStyles]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    />
  )
}

export const AnimatedButton = forwardRef(AnimatedButtonBase)
