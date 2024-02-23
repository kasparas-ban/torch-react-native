import React from "react"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import {
  BottomTabBarProps,
  BottomTabHeaderProps,
} from "@react-navigation/bottom-tabs"
import { BlurView } from "expo-blur"
import { Image, ImageBackground } from "expo-image"
import { Tabs } from "expo-router"
import { Pressable } from "react-native"
import Animated from "react-native-reanimated"
import { Text, View } from "@/components/Themed"
import { useClientOnlyValue } from "@/components/useClientOnlyValue"
import { useColorScheme } from "@/components/useColorScheme"

import AccountIcon from "../../assets/icons/navigationIcons/account.svg"
import GoalsIcon from "../../assets/icons/navigationIcons/goals.svg"
import StatsIcon from "../../assets/icons/navigationIcons/stats.svg"
import TimerIcon from "../../assets/icons/navigationIcons/timer.svg"
import WorldIcon from "../../assets/icons/navigationIcons/world.svg"

type TabParams =
  | {
      isHighlighted: boolean
    }
  | undefined

const NAVBAR_ICONS = [GoalsIcon, StatsIcon, TimerIcon, WorldIcon, AccountIcon]

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
        tabBar={props => <BottomTabBar tabBarProps={props} />}
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
        <Tabs.Screen name="account" options={{ title: "Account" }} />
        <Tabs.Screen name="index" options={{ href: null }} />
      </Tabs>
    </ImageBackground>
  )
}

function Header(props: BottomTabHeaderProps) {
  const { options } = props

  return (
    <View
      style={{
        height: 112,
        paddingHorizontal: 24,
        justifyContent: "flex-end",
        backgroundColor: "transparent",
      }}
    >
      <View
        style={{
          position: "absolute",
          right: 0,
          left: 0,
          top: 0,
        }}
      >
        <Image
          source={require("@/assets/images/header_background.png")}
          style={{
            position: "absolute",
            top: -30,
            right: 0,
            left: 0,
            height: 600,
            maxWidth: 500,
            marginHorizontal: "auto",
          }}
        />
      </View>
      <Text
        style={{
          fontSize: 46,
          fontWeight: "700",
          fontFamily: "Gabarito",
          color: Colors.gray[400],
        }}
      >
        {options.title}
      </Text>
    </View>
  )
}

function BottomTabBar({ tabBarProps }: { tabBarProps: BottomTabBarProps }) {
  const { state, descriptors, navigation } = tabBarProps
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        height: 64,
        width: "100%",
        backgroundColor: "transparent",
      }}
    >
      <View
        style={{
          position: "absolute",
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <Image
          source={require("@/assets/images/header_background.png")}
          style={{
            position: "absolute",
            bottom: -20,
            right: 0,
            left: 0,
            height: 600,
            transform: "rotate(180deg)",
            maxWidth: 500,
            marginHorizontal: "auto",
            opacity: 0.7,
          }}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: isDark
            ? "rgba(80, 80, 80, 0.5)"
            : "rgba(156, 163, 175, 0.3)",
          marginHorizontal: 20,
          borderRadius: 16,
          height: 62,
          minWidth: 380,
          maxWidth: 600,
          alignSelf: "center",
          paddingHorizontal: 12,
        }}
      >
        {/* Exclude the first index route */}
        {state.routes.slice(0, -1).map((route, index) => {
          const { options } = descriptors[route.key]
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel.toString()
              : options.title !== undefined
                ? options.title
                : route.name

          const Icon = NAVBAR_ICONS[index]
          const isFocused = state.index === index
          const isHighlighted = (route?.params as TabParams)?.isHighlighted
          const iconColor =
            colorScheme === "dark"
              ? isFocused
                ? Colors.slate[100]
                : Colors.gray[400]
              : isFocused
                ? Colors.slate[700]
                : Colors.slate[600]
          const highlightedIconColor =
            colorScheme === "dark"
              ? isFocused
                ? Colors.slate[700]
                : Colors.gray[700]
              : isFocused
                ? Colors.slate[700]
                : Colors.slate[600]

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          if (isHighlighted) {
            return (
              <Pressable
                key={index}
                role="button"
                testID={options.tabBarTestID}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <Image
                    style={{
                      flex: 1,
                      width: 48,
                      height: 48,
                      borderRadius: 100,
                      position: "absolute",
                    }}
                    source={require("@/assets/images/gradient_animation.gif")}
                  />
                  {!isFocused && (
                    <View
                      style={{
                        flex: 1,
                        width: 48,
                        height: 48,
                        borderRadius: 100,
                        position: "absolute",
                        backgroundColor: isDark ? "black" : "white",
                        opacity: 0.3,
                      }}
                    />
                  )}
                  <Icon
                    color={highlightedIconColor}
                    width={36}
                    height={36}
                    strokeWidth={2}
                    style={{ zIndex: 1 }}
                  />
                </View>
              </Pressable>
            )
          }

          return (
            <Pressable
              key={index}
              role="button"
              testID={options.tabBarTestID}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
              {isFocused && (
                <Animated.View
                  style={{ position: "absolute", width: 60, height: 60 }}
                  entering={FadeIn}
                  exiting={FadeOut}
                >
                  <Image
                    source={require("@/assets/images/highlight.png")}
                    style={{ flex: 1, opacity: 0.6 }}
                  />
                </Animated.View>
              )}
              <View
                style={{
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  color={iconColor}
                  width={26}
                  height={26}
                  strokeWidth={2}
                />
                <Text
                  style={{
                    color: iconColor,
                    fontSize: 11,
                    fontWeight: isFocused ? "700" : "400",
                  }}
                >
                  {label}
                </Text>
              </View>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
