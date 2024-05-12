import "react-native-get-random-values"

import { customAlphabet } from "./nanoid"

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12)

export function getRandomId() {
  return nanoid()
}
