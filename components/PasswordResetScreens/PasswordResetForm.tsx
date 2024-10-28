import { useState } from "react"
import Colors from "@/constants/Colors"
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import { z } from "zod"
import { useSignIn } from "@/lib/clerk"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import useKeyboard from "@/utils/useKeyboard"
import { notify } from "@/components/notifications/Notifications"
import PasswordInput from "@/components/PasswordInput"
import Button from "@/components/UI/Button"

const passwordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must contain at least 8 characters" })
      .max(30, { message: "Password must be less than 30 characters" })
      .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).*$/, {
        message:
          "Password must contain at least one number and both lowercase and uppercase characters",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must contain at least 8 characters" })
      .max(30, { message: "Password must be less than 30 characters" }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type PasswordFormType = z.infer<typeof passwordFormSchema>

export default function PasswordResetForm({ code }: { code: string }) {
  const isKeyboardOpen = useKeyboard()
  const { styles } = useThemeStyles(componentStyles)

  const { isLoaded, signIn, setActive } = useSignIn()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PasswordFormType>({
    resolver: zodResolver(passwordFormSchema),
    shouldUnregister: true,
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmitPress = async (data: PasswordFormType) => {
    setIsLoading(true)

    if (!isLoaded) {
      notify({
        title: "Request for password reset failed",
        description: "Internal application error",
        type: "ERROR",
      })
    }

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: data.newPassword,
      })

      if (result?.status === "complete") {
        await setActive?.({ session: result.createdSessionId })
      }

      router.replace("/(tabs)/account")
      notify({
        title: "Password reset complete",
        description: "We've logged you in :)",
      })
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
      <Text style={styles.text}>Type in your new password.</Text>

      <Controller
        name="newPassword"
        control={form.control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            placeholder="*******"
            label="New password"
            textContentType="newPassword"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorProps={{
              children: form.formState.errors.newPassword?.message,
            }}
            wrapperProps={{
              style: { marginBottom: 12 },
            }}
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={form.control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            placeholder="*******"
            label="Repeat new password"
            textContentType="newPassword"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorProps={{
              children: form.formState.errors.confirmPassword?.message,
            }}
            wrapperProps={{
              style: { marginBottom: 12 },
            }}
          />
        )}
      />

      {!isKeyboardOpen && (
        <View
          style={{
            position: "absolute",
            bottom: 28,
            width: "100%",
          }}
        >
          <Button
            scale={0.97}
            onPress={form.handleSubmit(onSubmitPress)}
            isLoading={isLoading}
          >
            Save
          </Button>
        </View>
      )}
    </>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    text: {
      color: isDark ? Colors.gray[300] : Colors.gray[600],
      textAlign: "center",
      fontSize: 14,
      width: "100%",
      marginBottom: 20,
    },
  })
