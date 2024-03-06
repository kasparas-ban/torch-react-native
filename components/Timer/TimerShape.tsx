import { ReactNode } from "react"
import { View } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import Svg, { Path } from "react-native-svg"

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
  const fractionComplete = 1 - currentTime / initialTime
  const strokeDashoffset = useSharedValue(fractionComplete)

  const size = 318
  const { path, pathLength } = getPathProps(size, 5, "counterclockwise")
  const strokeWidth = fractionComplete ? 5 : 0
  const stroke = isBreakActive ? "#60A5FA" : "#E11D48"
  const strokeLinecap = "round"

  strokeDashoffset.value = linearEase(
    initialTime - currentTime,
    0,
    pathLength,
    initialTime
  )

  strokeDashoffset.value = (pathLength * currentTime) / initialTime

  return (
    <View style={{ position: "relative" }}>
      <Svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <Path
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset.value}
          d={path}
          fill="none"
          stroke={stroke}
          strokeLinecap={strokeLinecap ?? "round"}
          strokeWidth={strokeWidth}
        />
      </Svg>
      {children}
    </View>
  )
}

const linearEase = (
  time: number,
  start: number,
  goal: number,
  duration: number
) => {
  if (duration === 0) return start

  const currentTime = (duration - time) / duration
  return start + goal * currentTime
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
