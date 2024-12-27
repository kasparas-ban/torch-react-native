import { Platform } from "react-native"
import { MMKV } from "react-native-mmkv"

const mmkvStorage = new MMKV({ id: "app-state-store" })

// Use this to control app state
// mmkvStorage.set("isFirstOpen", true)

export default function appStateStore() {
  return {
    isFirstOpen:
      Platform.OS === "web"
        ? false
        : (mmkvStorage.getBoolean("isFirstOpen") ?? true),
    setIsFirstOpen: (val: boolean) => mmkvStorage.set("isFirstOpen", val),
  }
}
