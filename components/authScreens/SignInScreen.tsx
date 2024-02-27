import React from "react"
import Colors from "@/constants/Colors"
import { useSignIn } from "@clerk/clerk-expo"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Pressable, StyleSheet, Text, useColorScheme, View } from "react-native"
import { z } from "zod"

import Button from "../UI/Button"
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
    <View style={styles.container}>
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
            style={{ marginBottom: 12 }}
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
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorProps={{
              children:
                form.formState.errors.email && "Please enter your password",
            }}
            style={{ marginBottom: 16 }}
          />
        )}
      />

      <Pressable style={{ marginBottom: 16 }}>
        <Text style={{ color: Colors.gray[700] }}>Forgot password?</Text>
      </Pressable>

      <Button>Login</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 160,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    backgroundColor: "red",
    width: "100%",
    paddingVertical: 14,
  },
  buttonFont: {
    height: 48,
  },
})
