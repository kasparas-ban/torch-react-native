import { useEffect } from "react"
import { DarkTheme } from "@/constants/Themes"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useColorScheme } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { NotifierWrapper } from "react-native-notifier"
import { ClerkProvider } from "@/components/providers/ClerkProvider"
import QueryProvider from "@/components/providers/QueryProvider"
import { StorageProvider } from "@/components/providers/StorageProvider"

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
    <QueryProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <NotifierWrapper>
              <StorageProvider />
              <ClerkProvider>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(modals)/sign-in"
                    options={{
                      presentation: "modal",
                      headerTransparent: true,
                      title: "",
                    }}
                  />
                  <Stack.Screen
                    name="(modals)/sign-up"
                    options={{
                      presentation: "modal",
                      headerTransparent: true,
                      title: "",
                    }}
                  />
                  <Stack.Screen
                    name="(modals)/sign-up-confirm"
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
                  <Stack.Screen
                    name="(modals)/timer-settings"
                    options={{
                      presentation: "modal",
                      headerTransparent: true,
                      title: "",
                    }}
                  />
                  <Stack.Screen
                    name="(modals)/(items)/general-item"
                    options={{
                      presentation: "modal",
                      headerTransparent: true,
                      title: "",
                    }}
                  />
                  <Stack.Screen
                    name="(modals)/(items)/add-task"
                    options={{
                      presentation: "modal",
                      headerTransparent: true,
                      title: "",
                    }}
                  />
                  <Stack.Screen
                    name="(modals)/(items)/add-goal"
                    options={{
                      presentation: "modal",
                      headerTransparent: true,
                      title: "",
                    }}
                  />
                  <Stack.Screen
                    name="(modals)/(items)/add-dream"
                    options={{
                      presentation: "modal",
                      headerTransparent: true,
                      title: "",
                    }}
                  />
                  <Stack.Screen
                    name="(modals)/(items)/edit-item"
                    options={{
                      presentation: "transparentModal",
                      animation: "fade",
                      headerTransparent: true,
                      title: "",
                      headerBackVisible: false,
                    }}
                  />
                  <Stack.Screen
                    name="(modals)/edit-profile"
                    options={{
                      presentation: "modal",
                      headerTransparent: true,
                      title: "",
                    }}
                  />
                  <Stack.Screen
                    name="(modals)/change-password"
                    options={{
                      presentation: "modal",
                      headerTransparent: true,
                      title: "",
                    }}
                  />
                  <Stack.Screen
                    name="(modals)/delete-account"
                    options={{
                      presentation: "modal",
                      headerTransparent: true,
                      title: "",
                    }}
                  />
                </Stack>
              </ClerkProvider>
            </NotifierWrapper>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryProvider>
  )
}
