import { Stack } from "expo-router"

export default function PublicAuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="privacy-policy"
        options={{
          presentation: "modal",
          headerTransparent: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="terms-of-service"
        options={{
          presentation: "modal",
          headerTransparent: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="version"
        options={{
          presentation: "modal",
          headerTransparent: true,
          title: "",
        }}
      />
    </Stack>
  )
}
