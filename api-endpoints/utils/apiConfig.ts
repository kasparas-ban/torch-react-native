import { Platform } from "react-native"

export const HOST = `http://${
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_BE_HOSTNAME_IOS
    : process.env.EXPO_PUBLIC_BE_HOSTNAME_ANDROID
}:${process.env.EXPO_PUBLIC_BE_PORT}`

export const FE_HOST = process.env.EXPO_PUBLIC_FE_HOSTNAME
