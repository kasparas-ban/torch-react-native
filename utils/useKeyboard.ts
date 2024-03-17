import { useEffect, useState } from "react"
import { Keyboard } from "react-native"

export default function useKeyboard() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsOpen(true)
    })
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsOpen(false)
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  return isOpen
}
