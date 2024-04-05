import Colors from "@/constants/Colors"
import { View } from "react-native"

function ItemProgress({
  progress,
  isRecurring,
}: {
  progress: number
  isRecurring?: boolean
}) {
  const progressColor = isRecurring ? Colors.amber[500] : Colors.red[400]

  return (
    <View
      style={{
        width: `${Math.trunc(progress * 100)}%`,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        backgroundColor: progressColor,
      }}
    />
  )
}

export default ItemProgress
