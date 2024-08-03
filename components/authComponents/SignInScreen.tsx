import React, { useState } from "react"
import Colors from "@/constants/Colors"
import { useSignIn } from "@/library/clerk"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { Keyboard, StyleSheet, Text, View } from "react-native"
import { z } from "zod"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { notify } from "../notifications/Notifications"
import PasswordInput from "../PasswordInput"
import Button from "../UI/Button"
import Link from "../UI/Link"
import TextInput from "../UI/TextInput"

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type SignInFormType = z.infer<typeof SignInSchema>

export default function SignInScreen() {
  const router = useRouter()
  const { signIn, setActive } = useSignIn()
  const { styles } = useThemeStyles(componentStyles)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInSchema),
    shouldUnregister: true,
  })

  const onSignInPress = async (data: SignInFormType) => {
    if (!signIn) {
      console.error("Clerk not loaded")
      return
    }
    Keyboard.dismiss()

    try {
      setIsLoading(true)
      const completeSignIn = await signIn.create({
        strategy: "password",
        identifier: data.email,
        password: data.password,
      })

      await setActive({ session: completeSignIn.createdSessionId })
      router.replace("/(tabs)/timer")
      notify({ title: "Login successful!" })
    } catch (err) {
      notify({ title: "Incorrect username or password", type: "ERROR" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!signIn) return null

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
    text: {
      color: isDark ? Colors.gray[400] : Colors.gray[900],
    },
    link: {
      marginLeft: "auto",
      marginRight: 4,
    },
  })
