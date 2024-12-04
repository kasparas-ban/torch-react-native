import { useState } from "react"
import InfoIcon from "@/assets/icons/info.svg"
import Colors from "@/constants/Colors"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, Text, View } from "react-native"
import { z } from "zod"
import { useAuth, useUser } from "@/lib/clerk"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import useKeyboard from "@/utils/useKeyboard"
import { notify } from "@/components/notifications/Notifications"
import PasswordInput from "@/components/PasswordInput"
import Button from "@/components/UI/Button"

const passwordFormSchema = z
  .object({
    currentPassword: z.string(),
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
  .refine(data => data.newPassword !== data.currentPassword, {
    message: "Current and new passwords match",
    path: ["newPassword"],
  })

export type PasswordFormType = z.infer<typeof passwordFormSchema>

export default function ChangePasswordScreen() {
  const isKeyboardOpen = useKeyboard()
  const { styles } = useThemeStyles(componentStyles)

  const { user } = useUser()
  const queryClient = useQueryClient()
  const { signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PasswordFormType>({
    resolver: zodResolver(passwordFormSchema),
    shouldUnregister: true,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmitPress = async (data: PasswordFormType) => {
    setIsLoading(true)

    try {
      if (!user) throw new Error("User not found")

      await user.updatePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        signOutOfOtherSessions: true,
      })
      await signOut()
      queryClient.invalidateQueries({ queryKey: ["user"] })

      router.back()
      notify({ title: "Password updated successfully" })
    } catch (e: any) {
      notify({
        title: "Password change failed",
        description:
          e?.errors?.[0]?.message || "Try changing your password later",
        type: "ERROR",
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
          <Text style={styles.title}>Change password</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <InfoIcon style={styles.infoIcon} color={Colors.amber[500]} />
          <Text style={styles.infoText}>
            Changing the password will log you out of all your devices.
          </Text>
        </View>

        <Controller
          name="currentPassword"
          control={form.control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              placeholder="*******"
              label="Current password"
              textContentType="password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorProps={{
                children: form.formState.errors.currentPassword?.message,
              }}
              wrapperProps={{
                style: { marginBottom: 12 },
              }}
            />
          )}
        />

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

        {isKeyboardOpen && (
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
      fontSize: 45,
    },
    infoIcon: {
      width: 26,
      height: 26,
    },
    infoText: {
      fontWeight: "500",
      color: isDark ? Colors.gray[300] : Colors.gray[600],
    },
  })
