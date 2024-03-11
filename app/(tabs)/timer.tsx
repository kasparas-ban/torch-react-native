import { StyleSheet, View } from "react-native"
import FocusInput from "@/components/Timer/FocusInput"
import TimerClock from "@/components/Timer/TimerClock"

export default function TimerScreen() {
  return (
    <View style={styles.container}>
      <View style={{ width: "100%", paddingHorizontal: 24, marginBottom: 40 }}>
        <FocusInput />
      </View>

      <TimerClock />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 130,
    backgroundColor: "transparent",
  },
})
