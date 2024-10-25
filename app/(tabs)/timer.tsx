import { StyleSheet, View } from "react-native"
import TimerClock from "@/components/Timer/TimerClock"
import FocusInfo from "@/components/Timer/TimerForm/FocusInfo"
import FocusItemSelect from "@/components/Timer/TimerForm/FocusItemSelect/FocusItemSelect"

export default function TimerScreen() {
  return (
    <View style={styles.container}>
      <View style={{ width: "100%", paddingHorizontal: 24, marginBottom: 12 }}>
        <FocusItemSelect />
        <View style={{ marginTop: 12, height: 64 }}>
          <FocusInfo />
        </View>
      </View>

      <TimerClock />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 120,
    backgroundColor: "transparent",
  },
})
