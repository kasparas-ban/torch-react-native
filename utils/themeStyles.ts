import { useMemo, useState } from "react"
import {
  ImageStyle,
  Platform,
  TextStyle,
  useColorScheme,
  ViewStyle,
} from "react-native"

export type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle
}

export type ThemeStylesProps = {
  isDark?: boolean
  isFocused?: boolean
  platform?: typeof Platform.OS
}

export type StyleType<T> = ({
  isDark,
  isFocused,
  platform,
}: ThemeStylesProps) => T

const useThemeStyles = <T extends NamedStyles<T> | NamedStyles<any>>(
  createStylesheet: StyleType<T>
) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [isFocused, setIsFocused] = useState(false)
  const onFocus = () => setIsFocused(true)
  const onBlur = () => setIsFocused(false)

  const memoStyles = useMemo(
    () => createStylesheet({ isDark, isFocused, platform: Platform.OS }),
    [isDark, isFocused, Platform.OS]
  )

  return {
    styles: memoStyles,
    isDark,
    isFocused,
    onFocus,
    onBlur,
  }
}

export default useThemeStyles
