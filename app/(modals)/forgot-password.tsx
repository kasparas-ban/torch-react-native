import { useState } from "react"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import ForgotPasswordConfirmation from "@/components/ForgotPasswordScreens/ForgotPasswordConfirmation"
import ForgotPasswordForm from "@/components/ForgotPasswordScreens/ForgotPasswordForm"
import ForgotPasswordRequest from "@/components/ForgotPasswordScreens/ForgotPasswordRequest"
import StepIndicator from "@/components/StepIndicator/StepIndicator"

export default function ForgotPasswordModal() {
  const { styles } = useThemeStyles(componentStyles)
  const [step, setStep] = useState(1)
  const [code, setCode] = useState("")

  const goNextStep = () => setStep(prev => ++prev)

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 4,
            justifyContent: "center",
          }}
        >
          <Text style={styles.title}>Password reset</Text>
        </View>

        <View style={{ marginBottom: 18, width: "100%", alignItems: "center" }}>
          <StepIndicator numSteps={3} activeStep={step} />
        </View>

        {step === 1 && <ForgotPasswordRequest goNextStep={goNextStep} />}
        {step === 2 && (
          <ForgotPasswordConfirmation
            code={code}
            setCode={setCode}
            goNextStep={goNextStep}
          />
        )}
        {step === 3 && <ForgotPasswordForm code={code} />}
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      alignItems: "center",
    },
    container: {
      flex: 1,
      marginTop: 100,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingHorizontal: 24,
      maxWidth: 400,
      width: "100%",
    },
    title: {
      color: isDark ? Colors.gray[300] : Colors.gray[400],
      fontFamily: "GabaritoSemibold",
      fontSize: 46,
    },
  })
