import { withTiming } from "react-native-reanimated"

export const FadeIn = () => {
  "worklet"
  const animations = {
    opacity: withTiming(1, { duration: 200 }),
    transform: [{ scale: withTiming(1, { duration: 200 }) }],
  }
  const initialValues = {
    opacity: 0,
    transform: [{ scale: 0.2 }],
  }
  return {
    initialValues,
    animations,
  }
}

export const FadeOut = () => {
  "worklet"
  const animations = {
    opacity: withTiming(0, { duration: 200 }),
    transform: [{ scale: withTiming(0.2, { duration: 200 }) }],
  }
  const initialValues = {
    opacity: 1,
    transform: [{ scale: 1 }],
  }
  return {
    initialValues,
    animations,
  }
}
