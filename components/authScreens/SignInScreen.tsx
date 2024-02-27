import React from "react"
import Colors from "@/constants/Colors"
import { useSignIn } from "@clerk/clerk-expo"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, Text, useColorScheme, View } from "react-native"
import { z } from "zod"

import Button from "../UI/Button"
import Link from "../UI/Link"
import TextInput from "../UI/TextInput"

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type SignInFormType = z.infer<typeof SignInSchema>

export default function SignInScreen() {
  const colorScheme = useColorScheme()
  const { signIn, setActive, isLoaded } = useSignIn()
  const isDark = colorScheme === "dark"

  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInSchema),
    // defaultValues: { email: "" },
    shouldUnregister: true,
  })

  const onSignInPress = async () => {
    // if (!isLoaded) return
    // try {
    //   const completeSignIn = await signIn.create({
    //     identifier: emailAddress,
    //     password,
    //   })
    //   // This is an important step,
    //   // This indicates the user is signed in
    //   await setActive({ session: completeSignIn.createdSessionId })
    // } catch (err: any) {
    //   console.log(err)
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

        <Link style={styles.link}>Forgot password?</Link>

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
            <Text>No account?</Text>
            <Link>Sign Up</Link>
          </View>

          <Button scale={0.97}>Login</Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
  link: {
    marginLeft: "auto",
    marginRight: 4,
  },
})
