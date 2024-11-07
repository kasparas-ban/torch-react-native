import { Platform } from "react-native"

export const BE_HOST = `${
  Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_BE_HOSTNAME_ANDROID
    : Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_BE_HOSTNAME_IOS
      : process.env.EXPO_PUBLIC_BE_HOSTNAME_WEB
}`

export const HOST = `${process.env.EXPO_PUBLIC_BE_PROTOCOL}://${BE_HOST}`

export const FE_HOST = process.env.EXPO_PUBLIC_FE_HOSTNAME
