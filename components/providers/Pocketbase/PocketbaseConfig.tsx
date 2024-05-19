import AsyncStorage from "@react-native-async-storage/async-storage"
import PocketBase, { AsyncAuthStore } from "pocketbase"
import { Platform } from "react-native"

const store = new AsyncAuthStore({
  save: async serialized => AsyncStorage.setItem("pb_auth", serialized),
  initial: AsyncStorage.getItem("pb_auth"),
})

const HOSTNAME =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_BE_HOSTNAME_IOS
    : process.env.EXPO_PUBLIC_BE_HOSTNAME_ANDROID

const pb = new PocketBase(`http://${HOSTNAME}:8090`, store)

export default pb
