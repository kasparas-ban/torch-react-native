import React from "react"
import { BlurView } from "expo-blur"
import { ImageBackground } from "expo-image"
import { Tabs } from "expo-router"
import {
  BottomTabBarItems,
  BottomTabBarWrapper,
  Header,
} from "@/components/navbar/navbar"
import { useClientOnlyValue } from "@/components/useClientOnlyValue"

export default function TabLayout() {
  return (
    <ImageBackground
      source={require("@/assets/images/background_gradient.png")}
      style={{ flex: 1 }}
    >
      <Tabs
        screenOptions={{
          tabBarBackground: () => <BlurView />,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
          headerTransparent: true,
          header: Header,
        }}
        tabBar={props => (
          <BottomTabBarWrapper>
            <BottomTabBarItems tabBarProps={props} />
          </BottomTabBarWrapper>
        )}
        sceneContainerStyle={{ backgroundColor: "transparent" }}
      >
        <Tabs.Screen
          name="goals"
          options={{
            title: "Goals",
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
          options={{ title: "Sign In" }}
          initialParams={{ isPrivate: true }}
        />
        <Tabs.Screen name="index" options={{ href: null }} />
      </Tabs>
    </ImageBackground>
  )
}
