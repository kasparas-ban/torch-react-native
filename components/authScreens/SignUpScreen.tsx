import * as React from "react"
import Colors from "@/constants/Colors"
import { useSignUp } from "@clerk/clerk-expo"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import { z } from "zod"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import Button from "../UI/Button"
import Link from "../UI/Link"
import TextInput from "../UI/TextInput"

const SignUpSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type SignUpFormType = z.infer<typeof SignUpSchema>

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { styles } = useThemeStyles(componentStyles)

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpSchema),
    shouldUnregister: true,
  })

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    // try {
    //   await signUp.create({
    //     firstName,
    //     lastName,
    //     emailAddress,
    //     password,
    //   })

    //   // send the email.
    //   await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

    //   // change the UI to our pending section.
    //   setPendingVerification(true)
    // } catch (err: any) {
    //   console.error(JSON.stringify(err, null, 2))
    // }
  }

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    // try {
    //   const completeSignUp = await signUp.attemptEmailAddressVerification({
    //     code,
    //   })

    //   await setActive({ session: completeSignUp.createdSessionId })
    // } catch (err: any) {
    //   console.error(JSON.stringify(err, null, 2))
    // }
  }

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
          <Text style={styles.title}>Sign Up</Text>
        </View>

        <Controller
          name="username"
          control={form.control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Username"
              textContentType="username"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorProps={{
                children:
                  form.formState.errors.username &&
                  "Please enter your username",
              }}
              wrapperProps={{
                style: { marginBottom: 12 },
              }}
            />
          )}
        />

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
            <TextInput
              placeholder="Password"
              textContentType="password"
              secureTextEntry
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

        <View style={{ position: "absolute", bottom: 48, width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              gap: 6,
              marginTop: 18,
              marginBottom: 18,
              justifyContent: "center",
            }}
          >
            <Text style={styles.text}>Already have an account?</Text>
            <Link href="/(modals)/sign-in">Sign In</Link>
          </View>

          <Button scale={0.97} onPress={form.handleSubmit(onSignUpPress)}>
            Sign Up
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
      color: Colors.gray[400],
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
