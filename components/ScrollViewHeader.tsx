import { ReactNode } from "react"
import { StyleProp, ViewStyle } from "react-native"
import Animated, {
  AnimatedScrollViewProps,
  AnimatedStyle,
  clamp,
  ScrollHandlerProcessed,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"

type CustomAnimatedScrollViewProps = AnimatedScrollViewProps & {
  style: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>
  onScroll: ScrollHandlerProcessed<Record<string, unknown>>
  children: ReactNode
}

export function AnimatedScrollView({
  style,
  onScroll,
  children,
  ...rest
}: CustomAnimatedScrollViewProps) {
  return (
    <Animated.ScrollView
      {...rest}
      style={style}
      stickyHeaderIndices={[0]}
      onScroll={onScroll}
    >
      {children}
    </Animated.ScrollView>
  )
}

export function useScrollViewHeader() {
  const headerScale = useSharedValue(1)
  const headerGradientOpacity = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler(event => {
    const fraction = 1 - (event.contentOffset.y - 10) / 20
    headerScale.value = clamp(fraction, 0.7, 1)
    headerGradientOpacity.value = clamp(1 - fraction, 0, 1)
  })

  const headerTitleStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: headerScale.value }] }
  })

  const headerGradientStyle = useAnimatedStyle(() => {
    return { opacity: headerGradientOpacity.value }
  })

  return {
    scrollHandler,
    headerTitleStyle,
    headerGradientStyle,
  }
}
