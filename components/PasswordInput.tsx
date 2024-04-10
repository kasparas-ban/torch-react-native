import { useState } from "react"
import ClosedEyeIcon from "@/assets/icons/closedEye.svg"
import OpenEyeIcon from "@/assets/icons/openEye.svg"
import Colors from "@/constants/Colors"
import { StyleSheet, View } from "react-native"
import useThemeStyles from "@/utils/themeStyles"

import TextInput, { TextInputProps } from "./UI/TextInput"

export default function PasswordInput(props: TextInputProps) {
  const { styles, isFocused, onFocus, onBlur } = useThemeStyles(inputStyles)
  const [isVisible, setIsVisible] = useState(false)

  const labelVisible = !!props.label

  return (
    <View style={styles.wrapper}>
      <TextInput
        {...props}
        textContentType={isVisible ? "none" : "password"}
        secureTextEntry={!isVisible}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {isVisible ? (
        <ClosedEyeIcon
          style={[styles.eyeIcon, { top: labelVisible ? 32 : 11 }]}
          color={isFocused ? Colors.gray[700] : Colors.gray[400]}
          onPress={() => setIsVisible(false)}
        />
      ) : (
        <OpenEyeIcon
          style={[styles.eyeIcon, { top: labelVisible ? 32 : 11 }]}
          color={isFocused ? Colors.gray[700] : Colors.gray[400]}
          onPress={() => setIsVisible(true)}
        />
      )}
    </View>
  )
}

const inputStyles = () =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    eyeIcon: {
      position: "absolute",
      width: 28,
      height: 28,
      right: 12,
      top: 11,
    },
  })
