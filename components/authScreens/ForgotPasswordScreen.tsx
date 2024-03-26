import React from "react"
import Colors from "@/constants/Colors"
import { useSignIn } from "@clerk/clerk-expo"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import { z } from "zod"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import Button from "../UI/Button"
import TextInput from "../UI/TextInput"

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
})

type ForgotPasswordFormType = z.infer<typeof ForgotPasswordSchema>

export default function ForgotPasswordScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const { styles } = useThemeStyles(componentStyles)

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(ForgotPasswordSchema),
    // defaultValues: { email: "" },
    shouldUnregister: true,
  })

  const onSignInPress = (data: ForgotPasswordFormType) => {
    console.log(data)
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
          <Text style={styles.title}>Forgot password</Text>
        </View>

        <Text style={styles.text}>
          Type in your email address and we'll send you a password reset link.
        </Text>

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

        <View style={{ position: "absolute", bottom: 28, width: "100%" }}>
          <Button scale={0.97} onPress={form.handleSubmit(onSignInPress)}>
            Send link
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
      color: isDark ? Colors.gray[400] : Colors.gray[600],
      marginBottom: 16,
      textAlign: "center",
      fontSize: 16,
      width: "100%",
    },
    link: {
      marginLeft: "auto",
      marginRight: 4,
    },
  })
