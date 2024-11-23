import { useLayoutEffect } from "react"
import Colors from "@/constants/Colors"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { Redirect, useNavigation, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import LottieView from "lottie-react-native"
import { StyleSheet, Text, View } from "react-native"
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { AnimatedButton } from "@/components/AnimatedButton"

import "./webStyles.css"

import appStateStore from "@/stores/appStore"

const DELAY = 100
const OFFSET = 60
const INITIAL_DELAY = 1000

export default function StartScreen() {
  const { styles, isDark } = useThemeStyles(componentStyles)
  const { isFirstOpen, setIsFirstOpen } = appStateStore()
  const router = useRouter()
  const navigate = useNavigation()

  const yPos1 = useSharedValue(OFFSET)
  const yPos2 = useSharedValue(OFFSET)
  const yPos3 = useSharedValue(OFFSET)
  const yPos4 = useSharedValue(OFFSET)
  const yPos5 = useSharedValue(OFFSET)

  const animValue = useSharedValue(0)

  useLayoutEffect(() => {
    animValue.value = withDelay(
      0 * DELAY + INITIAL_DELAY,
      withTiming(1, { easing: Easing.out(Easing.cubic) })
    )

    yPos1.value = withDelay(
      0 * DELAY + INITIAL_DELAY,
      withSpring(0, { damping: 20 })
    )
    yPos2.value = withDelay(
      1 * DELAY + INITIAL_DELAY,
      withSpring(0, { damping: 20 })
    )
    yPos3.value = withDelay(
      2 * DELAY + INITIAL_DELAY,
      withSpring(0, { damping: 20 })
    )
    yPos4.value = withDelay(
      3 * DELAY + INITIAL_DELAY,
      withSpring(0, { damping: 20 })
    )
    yPos5.value = withDelay(
      4 * DELAY + INITIAL_DELAY,
      withSpring(0, { damping: 20 })
    )
  }, [])

  const bloomAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animValue.value, [0, 1], [0, 1]),
    }
  })

  const itemAnimStyles1 = useAnimatedStyle(() => {
    return {
      opacity: interpolate(yPos1.value, [OFFSET, 0], [0, 1]),
      transform: [{ translateY: yPos1.value }],
    }
  })

  const itemAnimStyles2 = useAnimatedStyle(() => {
    return {
      opacity: interpolate(yPos2.value, [OFFSET, 0], [0, 1]),
      transform: [{ translateY: yPos2.value }],
    }
  })

  const itemAnimStyles3 = useAnimatedStyle(() => {
    return {
      opacity: interpolate(yPos3.value, [OFFSET, 0], [0, 1]),
      transform: [{ translateY: yPos3.value }],
    }
  })

  const itemAnimStyles4 = useAnimatedStyle(() => {
    return {
      opacity: interpolate(yPos4.value, [OFFSET, 0], [0, 1]),
      transform: [{ translateY: yPos4.value }],
    }
  })

  const itemAnimStyles5 = useAnimatedStyle(() => {
    return {
      opacity: interpolate(yPos5.value, [OFFSET, 0], [0, 1]),
      transform: [{ translateY: yPos5.value }],
    }
  })

  if (!isFirstOpen) return <Redirect href="/(tabs)/goals" />

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      {!isDark && (
        <Animated.View style={bloomAnimStyle}>
          <LightBackground />
        </Animated.View>
      )}
      {isDark && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: -120,
              height: "100%",
              width: "100%",
            },
            bloomAnimStyle,
          ]}
        >
          <Image
            source={require("@/assets/images/bloom_bg.png")}
            style={{
              height: "100%",
              width: "100%",
              marginHorizontal: "auto",
              maxWidth: 500,
            }}
          />
        </Animated.View>
      )}
      <Animated.View
        style={[
          { height: "100%", width: "100%", position: "absolute" },
          bloomAnimStyle,
        ]}
      >
        <BackgroundGradientView />
      </Animated.View>

      {!isDark && (
        <Animated.View
          style={[
            {
              position: "absolute",
              height: "100%",
              width: "100%",
              zIndex: -100,
            },
            bloomAnimStyle,
          ]}
        >
          <Image
            source={require("@/assets/images/lg_bg_gradient.png")}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              opacity: 0.4,
            }}
          />
        </Animated.View>
      )}

      <View style={styles.pageWrapper}>
        <View style={styles.containerWrapper}>
          <LottieView
            source={require("@/assets/lottie/onboarding.json")}
            style={{ width: 380, height: 380 }}
            loop={false}
            autoPlay
          />
          <Animated.Text style={[styles.loginLabel, itemAnimStyles1]}>
            Login to save your data online and sync all changes with all your
            devices
          </Animated.Text>
          <View
            style={{
              gap: 12,
              paddingTop: 20,
              paddingBottom: 12,
              maxWidth: 420,
              width: "100%",
            }}
          >
            <Animated.View style={itemAnimStyles2}>
              <AnimatedButton
                style={styles.loginBtn}
                scale={0.97}
                onPress={() => router.push("/(modals)/(publicAuth)/sign-in")}
              >
                <Text style={styles.loginBtnLabel}>Login</Text>
              </AnimatedButton>
            </Animated.View>

            <Animated.View style={itemAnimStyles3}>
              <AnimatedButton
                style={styles.registerBtn}
                scale={0.97}
                onPress={() => router.push("/(modals)/(publicAuth)/sign-up")}
              >
                <Text style={styles.registerBtnLabel}>Register</Text>
              </AnimatedButton>
            </Animated.View>
          </View>

          <View style={{ alignItems: "center", gap: 4 }}>
            <Animated.Text style={[styles.orText, itemAnimStyles4]}>
              or
            </Animated.Text>
            <Animated.View style={itemAnimStyles5}>
              <AnimatedButton
                scale={0.97}
                style={{ paddingVertical: 6 }}
                onPress={() => {
                  setIsFirstOpen(false)
                  router.replace("/(tabs)/goals")
                }}
              >
                <Text style={styles.noAccountBtn}>
                  continue without an account
                </Text>
              </AnimatedButton>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  )
}

function LightBackground() {
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "transparent"]}
        style={{ height: 60, zIndex: -100 }}
      />
      <Image
        source={require("@/assets/images/header_background.png")}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          height: 600,
          maxWidth: 500,
          marginHorizontal: "auto",
        }}
      />
    </View>
  )
}

function BackgroundGradientView() {
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <View
        style={{
          bottom: "-10%",
          width: "100%",
          height: "30%",
          position: "absolute",
        }}
      >
        <Image
          source={require("@/assets/images/lg_bg_gradient.png")}
          style={{
            height: 1000,
            width: "100%",
            maxWidth: 600,
            marginHorizontal: "auto",
            opacity: 0.4,
          }}
        />
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    pageWrapper: {
      height: "100%",
      display: "flex",
      justifyContent: "center",
    },
    containerWrapper: {
      alignItems: "center",
    },
    loginLabel: {
      fontSize: 14,
      maxWidth: 270,
      textAlign: "center",
      lineHeight: 20,
      color: isDark ? Colors.gray[200] : Colors.gray[700],
    },
    loginBtn: {
      backgroundColor: Colors.slate[100],
      borderColor: Colors.gray[300],
      borderWidth: 1,
      borderRadius: 12,
      height: 48,
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    registerBtnLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
    },
    registerBtn: {
      backgroundColor: Colors.rose[500],
      borderRadius: 12,
      height: 48,
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    loginBtnLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.rose[600],
    },
    orText: {
      color: isDark ? Colors.gray[200] : Colors.gray[700],
    },
    noAccountBtn: {
      fontWeight: "700",
      fontSize: 16,
      color: isDark ? Colors.rose[500] : Colors.rose[600],
    },
  })
