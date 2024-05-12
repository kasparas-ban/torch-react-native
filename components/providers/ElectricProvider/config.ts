import { NativeModules } from "react-native"

const { hostname } = new URL(NativeModules.SourceCode.scriptURL)

console.log("hostname", hostname)

export const DEBUG_MODE: boolean = __DEV__
export const ELECTRIC_URL: string =
  process.env.EXPO_PUBLIC_ELECTRIC_SERVICE ?? `ws://${hostname}:5133`
