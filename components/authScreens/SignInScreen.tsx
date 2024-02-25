import React from "react"
import Colors from "@/constants/Colors"
import { useSignIn } from "@clerk/clerk-expo"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, Text, TextInput, useColorScheme, View } from "react-native"
// import { Button, Input } from "tamagui"
import { z } from "zod"

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
      <View style={{ maxWidth: 330, width: "80%" }}>
        <Text
          style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}
        >
          Sign In
        </Text>
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
            style={{ maxWidth: 330, width: "80%", marginBottom: 12 }}
            // size="$5"
          />
        )}
      />
      {form.formState.errors.email && <Text>This is required.</Text>}

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
            style={{ maxWidth: 330, width: "80%", marginBottom: 12 }}
            // size="$5"
          />
        )}
      />
      {form.formState.errors.password && <Text>This is required.</Text>}

      {/* <Button size="$5" style={styles.button}>
        Login
      </Button> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 42,
    fontWeight: "900",
    marginBottom: 16,
    marginRight: "auto",
  },
  titleLight: {
    color: Colors.gray[700],
  },
  titleDark: {
    color: Colors.gray[300],
  },
  textInput: {
    width: "80%",
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "gray",
  },
  button: {
    width: "80%",
    fontWeight: "700",
    maxWidth: 330,
  },
  buttonFont: {
    fontSize: 20,
  },
})
