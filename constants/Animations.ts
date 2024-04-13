import { withTiming } from "react-native-reanimated"

export const FadeIn =
  (scale: number = 0.2, opacity: number = 1, duration: number = 200) =>
  () => {
    "worklet"
    const initialValues = {
      opacity: 0,
      transform: [{ scale }],
    }
    const animations = {
      opacity: withTiming(opacity, { duration }),
      transform: [{ scale: withTiming(1, { duration }) }],
    }
    return {
      initialValues,
      animations,
    }
  }

export const FadeOut =
  (scale: number = 0.2, opacity: number = 0, duration: number = 200) =>
  () => {
    "worklet"
    const initialValues = {
      opacity: 1,
      transform: [{ scale: 1 }],
    }
    const animations = {
      opacity: withTiming(opacity, { duration }),
      transform: [{ scale: withTiming(scale, { duration }) }],
    }
    return {
      initialValues,
      animations,
    }
  }

export const TextFlipEnter = () => {
  "worklet"
  const initialValues = {
    opacity: 0,
    transform: [{ translateY: 20 }],
  }
  const animations = {
    opacity: 1,
    transform: [{ translateY: 0 }],
  }
  return {
    initialValues,
    animations,
  }
}

export const TextFlipExit = () => {
  "worklet"
  const initialValues = {
    opacity: 1,
    transform: [{ translateY: 0 }],
  }
  const animations = {
    opacity: 0,
    transform: [{ translateY: -20 }],
  }
  return {
    initialValues,
    animations,
  }
}
