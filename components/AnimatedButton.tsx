import React from "react"
import { Pressable, PressableProps } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const DEFAULT_SCALE = 0.92
const DEFAULT_OPACITY = 0.7

type Props = PressableProps & {
  scale?: number
  opacity?: number
}

export function AnimatedButton(props: Props) {
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

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }
  })

  return (
    <AnimatedPressable
      key={props.children?.toString()}
      {...props}
      style={[props.style, animatedStyles]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    />
  )
}
