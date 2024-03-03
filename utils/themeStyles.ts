import { useState } from "react"
import {
  ImageStyle,
  Platform,
  TextStyle,
  useColorScheme,
  ViewStyle,
} from "react-native"

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle }

export type StyleType<T> = ({
  isDark,
  isFocused,
  platform,
}: {
  isDark?: boolean
  isFocused?: boolean
  platform?: typeof Platform.OS
}) => NamedStyles<T>

const useThemeStyles = <T>(createStylesheet: StyleType<T>) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [isFocused, setIsFocused] = useState(false)
  const onFocus = () => setIsFocused(true)
  const onBlur = () => setIsFocused(false)

  return {
    styles: createStylesheet({ isDark, isFocused, platform: Platform.OS }),
    isDark,
    isFocused,
    onFocus,
    onBlur,
  }
}

export default useThemeStyles
