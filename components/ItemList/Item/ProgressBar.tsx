import Colors from "@/constants/Colors"
import { StyleSheet, View } from "react-native"

function ItemProgress({
  progress,
  isRecurring,
}: {
  progress: number
  isRecurring?: boolean
}) {
  const progressColor = isRecurring ? Colors.amber[500] : Colors.red[400]

  return (
    <View style={StyleSheet.absoluteFillObject}>
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
    </View>
  )
}

export default ItemProgress
