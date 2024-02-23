import React from "react"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import {
  BottomTabBarProps,
  BottomTabHeaderProps,
} from "@react-navigation/bottom-tabs"
import { BlurView } from "expo-blur"
import { Image } from "expo-image"
import { Tabs } from "expo-router"
import { TouchableOpacity } from "react-native"
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

const AnimatedImage = Animated.createAnimatedComponent(Image)

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarBackground: () => <BlurView />,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        headerTransparent: true,
        header: Header,
      }}
      tabBar={props => <BottomTabBar tabBarProps={props} />}
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
  )
}

function Header(props: BottomTabHeaderProps) {
  const { options } = props

  return (
    <View
      style={{
        height: 92,
        paddingHorizontal: 24,
        justifyContent: "flex-end",
      }}
    >
      <Text
        style={{
          fontSize: 32,
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

  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        height: 64,
        width: "100%",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "rgba(156, 163, 175, 0.3)",
          marginHorizontal: 20,
          borderRadius: 16,
          height: 58,
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
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
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
                    width: 44,
                    height: 44,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <Image
                    style={{
                      flex: 1,
                      width: 44,
                      height: 44,
                      borderRadius: 100,
                      position: "absolute",
                    }}
                    source={require("@/assets/gradient.webm")}
                  />
                  <Icon
                    color={isFocused ? Colors.slate[700] : Colors.slate[600]}
                    width={30}
                    height={30}
                    strokeWidth={2}
                  />
                </View>
              </TouchableOpacity>
            )
          }

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
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
                <AnimatedImage
                  source={require("@/assets/images/highlight.png")}
                  style={{ position: "absolute", width: 60, height: 60 }}
                  entering={FadeIn}
                  exiting={FadeOut}
                />
              )}
              <View
                style={{
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  color={isFocused ? Colors.slate[700] : Colors.slate[600]}
                  width={26}
                  height={26}
                  strokeWidth={2}
                />
                <Text
                  style={{
                    color: isFocused ? Colors.slate[700] : Colors.slate[600],
                    fontSize: 11,
                    fontWeight: isFocused ? "700" : "400",
                  }}
                >
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
