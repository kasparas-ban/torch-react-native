import { useState } from "react"
import Colors from "@/constants/Colors"
import appStateStore from "@/stores/appStore"
import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"
import { useSignUp } from "@/lib/clerk"
import { useRegisterUser } from "@/api/hooks/user/useUser"
import { CustomErrorData } from "@/api/utils/errorMsgs"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import useSignUpData from "@/components/authComponents/SignUpStore"
import CodeInput from "@/components/CodeInput/CodeInput"
import { notify } from "@/components/notifications/Notifications"
import Button from "@/components/UI/Button"

export default function SignUpConfirmModal() {
  const { styles } = useThemeStyles(componentStyles)
  const { userData, setUserData } = useSignUpData()
  const { setIsFirstOpen } = appStateStore()

  const { isLoaded, signUp, setActive } = useSignUp()

  const [code, setCode] = useState("")
  const { mutateAsync: registerUser } = useRegisterUser()
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)

    if (!isLoaded || !userData) {
      notify({
        title: "Registration failed",
        description: "Internal application error",
        type: "ERROR",
      })
      setIsLoading(false)
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      // MARK: Is there any way to undo Clerk sign up if the following fails?
      if (completeSignUp.createdUserId) {
        await registerUser({
          ...userData,
          clerkID: completeSignUp.createdUserId,
        })
        await setActive({ session: completeSignUp.createdSessionId })
      } else {
        throw new Error("Registration failed")
      }

      router.replace("/(tabs)/account")
      notify({
        title: `Welcome to the app, ${userData.username}!`,
      })
      setUserData(undefined)
      setIsFirstOpen(false)
    } catch (e: any) {
      const errorData = e.data as CustomErrorData
      notify({
        title: errorData?.title || "Verification failed",
        description:
          errorData?.description || "Code is either incorrect or expired",
        type: "ERROR",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 20,
          }}
        >
          <Text style={styles.title}>Verify email</Text>
        </View>

        <Text style={styles.infoText}>
          Type in the code sent to
          <Text
            style={styles.emailText}
          >{` ${userData?.email || "your email"} `}</Text>
          to verify your registration.
        </Text>

        <CodeInput code={code} setCode={setCode} />

        <View style={{ position: "absolute", bottom: 28, width: "100%" }}>
          <Button
            scale={0.97}
            onPress={handleConfirm}
            isDisabled={code.length < 6}
            isLoading={isLoading}
          >
            Confirm
          </Button>
        </View>
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
      width: "100%",
      textAlign: "center",
    },
    infoText: {
      color: isDark ? Colors.gray[300] : Colors.gray[700],
      width: "100%",
      textAlign: "center",
      lineHeight: 24,
    },
    emailText: {
      fontWeight: "700",
      color: isDark ? Colors.gray[100] : Colors.gray[700],
    },
  })
