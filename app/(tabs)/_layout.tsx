import React from "react"
import { useAuth } from "@clerk/clerk-expo"
import { BlurView } from "expo-blur"
import { ImageBackground } from "expo-image"
import { Tabs } from "expo-router"
import { Platform } from "react-native"
import GoalsHeader from "@/components/navbar/GoalsHeader"
import {
  BottomTabBarItems,
  BottomTabBarWrapper,
  Header,
} from "@/components/navbar/navbar"

export default function TabLayout() {
  const { isSignedIn } = useAuth()

  return (
    <ImageBackground
      source={require("@/assets/images/background_gradient.png")}
      style={{ flex: 1 }}
    >
      <Tabs
        screenOptions={{
          tabBarBackground: () => <BlurView />,
          headerTransparent: true,
          header: props => <Header {...props} />,
        }}
        tabBar={props => (
          <BottomTabBarWrapper>
            <BottomTabBarItems tabBarProps={props} />
          </BottomTabBarWrapper>
        )}
        sceneContainerStyle={{
          backgroundColor: "transparent",
          width: "100%",
          ...(Platform.OS === "web"
            ? {
                maxWidth: Platform.OS === "web" ? 850 : "auto",
                marginHorizontal: "auto",
              }
            : {}),
        }}
      >
        <Tabs.Screen
          name="goals"
          options={{
            title: "Goals",
            header: () => <GoalsHeader />,
          }}
        />
        <Tabs.Screen name="stats" options={{ title: "Stats" }} />
        <Tabs.Screen
          name="timer"
          options={{ title: "Timer" }}
          initialParams={{ isHighlighted: true }}
        />
        <Tabs.Screen name="world" options={{ title: "World" }} />
        <Tabs.Screen
          name="account"
          options={{ title: "Account" }}
          initialParams={{ isPrivate: !isSignedIn }}
        />
        <Tabs.Screen name="index" options={{ href: null }} />
      </Tabs>
    </ImageBackground>
  )
}
