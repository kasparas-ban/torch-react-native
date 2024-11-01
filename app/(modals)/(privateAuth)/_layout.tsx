import { Redirect, Stack } from "expo-router"
import { useCustomAuth } from "@/lib/useCustomAuth"

export default function PrivateAuthLayout() {
  const { isSignedIn } = useCustomAuth()

  if (!isSignedIn) return <Redirect href="/(modals)/(publicAuth)/sign-in" />

  return (
    <Stack>
      <Stack.Screen
        name="edit-profile"
        options={{
          presentation: "modal",
          headerTransparent: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          presentation: "modal",
          headerTransparent: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="delete-account"
        options={{
          presentation: "modal",
          headerTransparent: true,
          title: "",
        }}
      />
    </Stack>
  )
}
