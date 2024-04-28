import { customAlphabet } from "nanoid"

import "react-native-get-random-values"

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12)

export function getRandomId() {
  return nanoid()
}
