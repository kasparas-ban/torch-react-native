import { useState } from "react"
import ClosedEyeIcon from "@/assets/icons/closedEye.svg"
import OpenEyeIcon from "@/assets/icons/openEye.svg"
import Colors from "@/constants/Colors"
import { StyleSheet, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import TextInput, { TextInputProps } from "./UI/TextInput"

export default function PasswordInput(props: TextInputProps) {
  const { styles } = useThemeStyles(inputStyles)
  const [isVisible, setIsVisible] = useState(false)

  return (
    <View style={styles.wrapper}>
      <TextInput
        {...props}
        textContentType={isVisible ? "none" : "password"}
        secureTextEntry={!isVisible}
      />
      {isVisible ? (
        <ClosedEyeIcon
          style={styles.eyeIcon}
          color={Colors.gray[400]}
          onPress={() => setIsVisible(false)}
        />
      ) : (
        <OpenEyeIcon
          style={styles.eyeIcon}
          color={Colors.gray[400]}
          onPress={() => setIsVisible(true)}
        />
      )}
    </View>
  )
}

const inputStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    eyeIcon: {
      position: "absolute",
      width: 32,
      height: 32,
      right: 8,
      top: 8,
    },
  })
