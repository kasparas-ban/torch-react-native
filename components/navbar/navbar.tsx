import { ReactNode } from "react"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import {
  BottomTabBarProps,
  BottomTabHeaderProps,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs"
import { BlurView } from "expo-blur"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { Link } from "expo-router"
import { Pressable, Text, useColorScheme, View } from "react-native"
import Animated from "react-native-reanimated"
import { useAuth } from "@/lib/clerk"

import AccountIcon from "../../assets/icons/navigationIcons/account.svg"
import GoalsIcon from "../../assets/icons/navigationIcons/goals.svg"
import StatsIcon from "../../assets/icons/navigationIcons/stats.svg"
import TimerIcon from "../../assets/icons/navigationIcons/timer.svg"
import WorldIcon from "../../assets/icons/navigationIcons/world.svg"

type TabParams =
  | {
      isHighlighted?: boolean
      isPrivate?: boolean
    }
  | undefined

const NAVBAR_ICONS = [GoalsIcon, StatsIcon, TimerIcon, WorldIcon, AccountIcon]

export function Header(props: BottomTabHeaderProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

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
        pointerEvents="none"
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
          fontFamily: "GabaritoSemibold",
          color: isDark ? Colors.gray[300] : Colors.gray[400],
        }}
      >
        {props.options.title}
      </Text>
    </View>
  )
}

export function BottomTabBarWrapper({ children }: { children: ReactNode }) {
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
        pointerEvents="none"
      >
        <LinearGradient
          colors={["transparent", isDark ? Colors.gray[900] : "white"]}
          locations={[0, 0.3]}
          style={{
            height: 100,
            position: "absolute",
            right: 0,
            left: 0,
            bottom: -20,
          }}
        />
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
            ? "rgba(110, 110, 110, 0.5)"
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
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <BlurView
            style={{
              position: "relative",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            intensity={1}
            experimentalBlurMethod="dimezisBlurView"
          />
        </View>

        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            flexDirection: "row",
            zIndex: 1000,
          }}
        >
          {children}
        </View>
      </View>
    </View>
  )
}

export function BottomTabBarItems({
  tabBarProps,
}: {
  tabBarProps: BottomTabBarProps
}) {
  const { state, descriptors, navigation } = tabBarProps
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const { isSignedIn } = useAuth()

  return (
    <>
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
        const isHighlighted = !!(route?.params as TabParams)?.isHighlighted
        const isPrivate = !!(route?.params as TabParams)?.isPrivate

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
            <NavBarButton
              key={index}
              options={options}
              onPress={onPress}
              isFocused={isFocused}
              isPrivate={isPrivate && !isSignedIn}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  overflow: "hidden",
                  borderRadius: 100,
                }}
              >
                <Image
                  style={{
                    flex: 1,
                    width: 48,
                    height: 48,
                    borderRadius: 100,
                    position: "absolute",
                    overflow: "hidden",
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
            </NavBarButton>
          )
        }

        return (
          <NavBarButton
            key={index}
            options={options}
            onPress={onPress}
            isFocused={isFocused}
            isPrivate={isPrivate && !isSignedIn}
          >
            {isFocused && (
              <Animated.View
                style={{ position: "absolute", width: 60, height: 60 }}
                entering={FadeIn()}
                exiting={FadeOut()}
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
              <Icon color={iconColor} width={26} height={26} strokeWidth={2} />
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
          </NavBarButton>
        )
      })}
    </>
  )
}

function NavBarButton({
  options,
  onPress,
  isFocused,
  isPrivate,
  children,
}: {
  options: BottomTabNavigationOptions
  onPress: () => void
  isFocused: boolean
  isPrivate: boolean
  children: ReactNode
}) {
  return isPrivate ? (
    <Link href="/(modals)/(publicAuth)/sign-in" asChild>
      <Pressable
        role="button"
        accessibilityLabel={options.tabBarAccessibilityLabel}
        accessibilityState={isFocused ? { selected: true } : {}}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        {children}
      </Pressable>
    </Link>
  ) : (
    <Pressable
      role="button"
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
      {children}
    </Pressable>
  )
}
