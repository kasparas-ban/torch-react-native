import React, { useState } from "react"
import Colors from "@/constants/Colors"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Keyboard, StyleSheet, Text, View } from "react-native"
import { z } from "zod"
import { useSignIn } from "@/lib/clerk"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { notify } from "../notifications/Notifications"
import Button from "../UI/Button"
import TextInput from "../UI/TextInput"

const PasswordResetSchema = z.object({
  email: z.string().email(),
})

type PasswordResetFormType = z.infer<typeof PasswordResetSchema>

export default function PasswordResetRequest({
  goNextStep,
}: {
  goNextStep: () => void
}) {
  const { styles } = useThemeStyles(componentStyles)

  const { signIn } = useSignIn()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PasswordResetFormType>({
    resolver: zodResolver(PasswordResetSchema),
    shouldUnregister: true,
  })

  const onConfirmPress = async (data: PasswordResetFormType) => {
    Keyboard.dismiss()
    setIsLoading(true)
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      })
      goNextStep()
    } catch (e: any) {
      notify({
        title: "Request for password reset failed",
        description:
          e?.errors?.[0]?.message || "Try resetting your password later",
        type: "ERROR",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Text style={styles.text}>
        Type in your email address and we'll send you further instructions to
        reset your password.
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
        <Button
          scale={0.97}
          onPress={form.handleSubmit(onConfirmPress)}
          isLoading={isLoading}
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
      marginBottom: 16,
      textAlign: "center",
      fontSize: 14,
      width: "100%",
    },
    link: {
      marginLeft: "auto",
      marginRight: 4,
    },
  })
