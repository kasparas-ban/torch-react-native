import React from "react"
import Colors from "@/constants/Colors"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { Tabs } from "expo-router"
import { TouchableOpacity } from "react-native"
import { Text, View } from "@/components/Themed"
import { useClientOnlyValue } from "@/components/useClientOnlyValue"
import { useColorScheme } from "@/components/useColorScheme"

import AccountIcon from "../../assets/icons/navigationIcons/account.svg"
import GoalsIcon from "../../assets/icons/navigationIcons/goals.svg"
import StatsIcon from "../../assets/icons/navigationIcons/stats.svg"
import TimerIcon from "../../assets/icons/navigationIcons/timer.svg"
import WorldIcon from "../../assets/icons/navigationIcons/world.svg"

const NAVBAR_ICONS = [GoalsIcon, StatsIcon, TimerIcon, WorldIcon, AccountIcon]

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        headerTransparent: true,
      }}
      tabBar={BottomTabBar}
    >
      <Tabs.Screen
        name="goals"
        options={{
          title: "Goals",
          // tabBarIcon: ({ color }) => <Text>TEST</Text>,
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <FontAwesome
          //           name="info-circle"
          //           size={25}
          //           color={Colors[colorScheme ?? "light"].text}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
        }}
      />
      <Tabs.Screen name="stats" options={{ title: "Stats" }} />
      <Tabs.Screen name="timer" options={{ title: "Timer" }} />
      <Tabs.Screen name="world" options={{ title: "World" }} />
      <Tabs.Screen name="account" options={{ title: "Account" }} />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  )
}

function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
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
          backgroundColor: "tomato",
          marginHorizontal: 20,
          borderRadius: 24,
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

          const isFocused = state.index === index

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

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            })
          }

          const Icon = NAVBAR_ICONS[index]

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              testID={options.tabBarTestID}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon color="black" width={24} height={24} strokeWidth={2} />
              <Text
                style={{
                  color: isFocused ? "#673ab7" : "#222",
                  fontSize: 11,
                  fontWeight: isFocused ? "700" : "400",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
