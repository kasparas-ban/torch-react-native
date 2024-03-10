import { StyleSheet, View } from "react-native"
import TimerClock from "@/components/Timer/TimerClock"

export default function TimerScreen() {
  return (
    <View style={styles.container}>
      <TimerClock />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
})
