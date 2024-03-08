import { ReactNode, useEffect } from "react"
import Colors from "@/constants/Colors"
import { useColorScheme, View } from "react-native"
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import Svg, { Path } from "react-native-svg"

const AnimatedPath = Animated.createAnimatedComponent(Path)

export default function TimerShape({
  initialTime,
  currentTime,
  isBreakActive,
  children,
}: {
  initialTime: number
  currentTime: number
  isBreakActive: boolean
  children: ReactNode
}) {
  const size = 318
  const { path, pathLength } = getPathProps(size, 5, "counterclockwise")
  const fractionComplete = useSharedValue(1 - currentTime / initialTime)

  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  useEffect(() => {
    fractionComplete.value = 1 - currentTime / initialTime
  }, [currentTime])

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(pathLength * fractionComplete.value, {
        duration: 1000,
        easing: Easing.linear,
      }),
    }
  })

  const breakPathColor = Colors.sky[400]
  const timerPathColor = isDark ? Colors.rose[600] : Colors.rose[500]
  const backgroundPathColor = isDark ? Colors.gray[600] : Colors.gray[300]

  return (
    <View style={{ position: "relative" }}>
      <Svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        style={{ position: "absolute" }}
      >
        <Path
          d={path}
          fill="none"
          stroke={backgroundPathColor}
          strokeLinecap="round"
          strokeWidth={2}
        />
      </Svg>
      <Svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        style={{ zIndex: 1 }}
      >
        <AnimatedPath
          animatedProps={animatedProps}
          strokeDasharray={pathLength}
          d={path}
          fill="none"
          stroke={isBreakActive ? breakPathColor : timerPathColor}
          strokeLinecap="round"
          strokeWidth={4}
        />
      </Svg>
      {children}
    </View>
  )
}

const getPathProps = (
  size: number,
  strokeWidth: number,
  rotation: "clockwise" | "counterclockwise"
) => {
  const halfSize = size / 2
  const halfStrokeWith = strokeWidth / 2
  const arcRadius = halfSize - halfStrokeWith
  const arcDiameter = 2 * arcRadius
  const rotationIndicator = rotation === "clockwise" ? "1,0" : "0,1"

  const pathLength = 2 * Math.PI * arcRadius
  const path = `m ${halfSize},${halfStrokeWith} a ${arcRadius},${arcRadius} 0 ${rotationIndicator} 0,${arcDiameter} a ${arcRadius},${arcRadius} 0 ${rotationIndicator} 0,-${arcDiameter}`

  return { path, pathLength }
}
