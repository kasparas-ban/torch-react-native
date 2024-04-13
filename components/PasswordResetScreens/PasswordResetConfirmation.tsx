import React from "react"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import CodeInput from "../CodeInput/CodeInput"
import Button from "../UI/Button"

type PasswordResetProps = {
  code: string
  setCode: React.Dispatch<React.SetStateAction<string>>
  goNextStep: () => void
}

const CODE_LENGTH = 6

export default function PasswordResetConfirmation({
  code,
  setCode,
  goNextStep,
}: PasswordResetProps) {
  const { styles } = useThemeStyles(componentStyles)

  return (
    <>
      <Text style={styles.text}>
        Type in the code sent to your email to start the password reset process.
      </Text>

      <CodeInput code={code} setCode={setCode} />

      <View style={{ position: "absolute", bottom: 28, width: "100%" }}>
        <Button
          scale={0.97}
          onPress={() => goNextStep()}
          isDisabled={code.length !== CODE_LENGTH}
        >
          Confirm
        </Button>
      </View>
    </>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    text: {
      color: isDark ? Colors.gray[300] : Colors.gray[600],
      textAlign: "center",
      fontSize: 14,
      width: "100%",
    },
    link: {
      marginLeft: "auto",
      marginRight: 4,
    },
  })
