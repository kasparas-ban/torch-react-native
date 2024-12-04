import { useState } from "react"
import Colors from "@/constants/Colors"
import { queryClient } from "@/providers/QueryProvider"
import useUserInfo from "@/stores/userStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { Keyboard, StyleSheet, Text, View } from "react-native"
import { z } from "zod"
import { useAuth } from "@/lib/clerk"
import { deleteAccount } from "@/api/endpoints/userAPI"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { notify } from "@/components/notifications/Notifications"
import Button from "@/components/UI/Button"
import TextInput from "@/components/UI/TextInput"

const getDeleteAccountFormSchema = (username: string) =>
  z.object({
    checkText: z.literal(username, {
      errorMap: () => ({ message: "Enter required text" }),
    }),
  })

export default function DeleteAccountScreen() {
  const { styles, isDark } = useThemeStyles(componentStyles)

  const { getToken, signOut } = useAuth()
  const { user } = useUserInfo()
  const [isLoading, setIsLoading] = useState(false)

  const defaultCheckText = `delete ${user?.username ?? "my"} account`
  const deleteAccountSchema = getDeleteAccountFormSchema(defaultCheckText)

  const form = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { checkText: "" },
  })

  const handleDeleteAccount = async () => {
    Keyboard.dismiss()
    setIsLoading(true)

    const token = await getToken()
    if (!token) throw Error("No token found")

    deleteAccount(token)
      .then(() => {
        signOut()
        queryClient.invalidateQueries({ queryKey: ["user"] })
        router.push("/")
        notify({ title: "Account deleted successfully" })
      })
      .catch(() => {
        notify({
          title: "Failed to delete your account",
          description: "Unexpected error has occured.",
          type: "ERROR",
        })
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 20,
            justifyContent: "center",
          }}
        >
          <Text style={styles.title}>Delete account</Text>
        </View>

        <Text
          style={{
            textAlign: "center",
            marginBottom: 12,
            color: isDark ? Colors.gray[300] : Colors.gray[600],
          }}
        >
          This action{" "}
          <Text
            style={{
              fontWeight: "700",
              color: isDark ? Colors.gray[100] : Colors.gray[800],
            }}
          >
            cannot
          </Text>{" "}
          be undone. This will permanently delete your account and all
          associated information with it.
        </Text>

        <Text
          style={{
            textAlign: "center",
            color: isDark ? Colors.gray[300] : Colors.gray[600],
            marginBottom: 18,
          }}
        >
          Please type{" "}
          <Text
            style={{
              fontWeight: "700",
              color: isDark ? Colors.gray[100] : Colors.gray[800],
            }}
          >
            {defaultCheckText}
          </Text>{" "}
          to confirm.
        </Text>

        <Controller
          name="checkText"
          control={form.control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Aa"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || undefined}
              errorProps={{
                children:
                  form.formState.errors.checkText &&
                  "Text does not match the requirements",
              }}
            />
          )}
        />

        <View
          style={{
            position: "absolute",
            bottom: 28,
            width: "100%",
          }}
        >
          <Button
            scale={0.97}
            onPress={form.handleSubmit(handleDeleteAccount)}
            isLoading={isLoading}
          >
            Delete
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
      fontSize: 45,
    },
  })
