import { useEffect } from "react"
import AlertIcon from "@/assets/icons/exclamationCircle.svg"
import Colors from "@/constants/Colors"
import useDev from "@/devTools/useDev"
import { zodResolver } from "@hookform/resolvers/zod"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { Controller, useForm } from "react-hook-form"
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { z } from "zod"
import { useSignIn } from "@/lib/clerk"
import InternalError, { isInternalError } from "@/lib/InternalError"
import { useClerkSignIn } from "@/lib/useCustomAuth"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { notify } from "@/components/notifications/Notifications"
import PasswordInput from "@/components/PasswordInput"
import Button from "@/components/UI/Button"
import Link from "@/components/UI/Link"
import TextInput from "@/components/UI/TextInput"

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type SignInFormType = z.infer<typeof SignInSchema>

export default function SignInModal() {
  const { styles } = useThemeStyles(componentStyles)

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 12,
          }}
        >
          <Text style={styles.title}>Sign In</Text>
        </View>

        <ErrorBoundary FallbackComponent={SignInError}>
          <SignInForm />
        </ErrorBoundary>
      </View>
    </View>
  )
}

function SignInError({ error, resetErrorBoundary }: FallbackProps) {
  const err = isInternalError(error) ? error : undefined
  const { styles } = useThemeStyles(componentStyles)
  const { isOnline } = useDev()
  const { signIn } = useSignIn()

  useEffect(() => {
    if (isOnline && signIn) resetErrorBoundary()
  }, [isOnline, signIn])

  return (
    <View
      style={{
        height: "70%",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <AlertIcon color={Colors.gray[50]} style={styles.errorIcon} />
      <Text style={styles.errorTitle}>{err?.title}</Text>
      <Text style={styles.errorDescription}>{err?.description}</Text>
    </View>
  )
}

function SignInLoading() {
  const { styles } = useThemeStyles(componentStyles)

  return (
    <View
      style={{
        height: "70%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
      }}
    >
      <ActivityIndicator color={Colors.gray[50]} />
      <Text style={styles.errorTitle}>Loading...</Text>
    </View>
  )
}

function SignInForm() {
  const { signIn, isLoaded, isLoading } = useClerkSignIn()
  const { styles } = useThemeStyles(componentStyles)
  const { isOnline } = useDev()

  if (!signIn) {
    throw new InternalError({
      title: "Server connection failed",
      description: "Make sure internet connection is available and try again",
    })
  }

  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInSchema),
    shouldUnregister: true,
  })

  const onSignInPress = async (data: SignInFormType) => {
    Keyboard.dismiss()

    try {
      await signIn({
        email: data.email,
        password: data.password,
      })
    } catch (err) {
      const error = isInternalError(err) ? err : undefined
      notify({
        title: error?.title || "Incorrect username or password",
        description: error?.description || undefined,
        type: "ERROR",
      })
    }
  }

  if (!isLoaded) return <SignInLoading />

  if (!isOnline)
    return (
      <View
        style={{
          height: "70%",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <AlertIcon color={Colors.gray[50]} style={styles.errorIcon} />
        <Text style={styles.errorTitle}>No internet connection</Text>
        <Text style={styles.errorDescription}>Go online to sign in</Text>
      </View>
    )

  return (
    <>
      <Controller
        name="email"
        control={form.control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorProps={{
              children:
                form.formState.errors.email && "Please enter your email",
            }}
            wrapperProps={{
              style: { marginBottom: 12 },
            }}
          />
        )}
      />

      <Controller
        name="password"
        control={form.control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorProps={{
              children:
                form.formState.errors.email && "Please enter your password",
            }}
            wrapperProps={{
              style: { marginBottom: 12 },
            }}
          />
        )}
      />

      <Link href="/(modals)/password-reset" style={styles.link}>
        Forgot password?
      </Link>

      <View style={{ position: "absolute", bottom: 28, width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            gap: 6,
            marginTop: 18,
            marginBottom: 18,
            justifyContent: "center",
          }}
        >
          <Text style={styles.text}>No account?</Text>
          <Link href="/(modals)/sign-up">Sign Up</Link>
        </View>

        <Button
          scale={0.97}
          onPress={form.handleSubmit(onSignInPress)}
          isLoading={isLoading}
        >
          Login
        </Button>
      </View>
    </>
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
    text: {
      color: isDark ? Colors.gray[400] : Colors.gray[900],
    },
    link: {
      marginLeft: "auto",
      marginRight: 4,
    },
    // Error boundary
    errorTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: isDark ? Colors.gray[300] : Colors.gray[400],
    },
    errorDescription: {
      fontSize: 16,
      color: isDark ? Colors.gray[400] : Colors.gray[500],
      textAlign: "center",
      maxWidth: 260,
    },
    errorIcon: {
      width: 50,
      height: 50,
    },
  })
