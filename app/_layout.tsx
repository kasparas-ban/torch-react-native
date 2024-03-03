import { useEffect } from "react"
import { DarkTheme } from "@/constants/Themes"
import { DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { ClerkProvider } from "@/components/providers/ClerkProvider"
import { useColorScheme } from "@/components/useColorScheme"

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router"

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Gabarito: require("../assets/fonts/Gabarito-VariableFont_wght.ttf"),
    GabaritoSemibold: require("../assets/fonts/Gabarito-SemiBold.ttf"),
    GabaritoBold: require("../assets/fonts/Gabarito-Bold.ttf"),
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ClerkProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modals)/sign-in"
            options={{
              presentation: "modal",
              headerTransparent: true,
              title: "",
            }}
          />
          <Stack.Screen
            name="(modals)/forgot-password"
            options={{
              presentation: "modal",
              headerTransparent: true,
              title: "",
            }}
          />
        </Stack>
      </ClerkProvider>
    </ThemeProvider>
  )
}
