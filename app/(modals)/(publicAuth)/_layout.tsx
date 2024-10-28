import { Redirect, Stack } from "expo-router"
import { useAuth } from "@/lib/clerk"

export default function PublicAuthLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) return <Redirect href="/(tabs)/account" />

  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{
          presentation: "modal",
          headerTransparent: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          presentation: "modal",
          headerTransparent: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="sign-up-confirm"
        options={{
          presentation: "modal",
          headerTransparent: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="password-reset"
        options={{
          presentation: "modal",
          headerTransparent: true,
          title: "",
        }}
      />
    </Stack>
  )
}
