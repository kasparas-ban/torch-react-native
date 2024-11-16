import { useLayoutEffect } from "react"
import Colors from "@/constants/Colors"
import { Image } from "expo-image"
import { router } from "expo-router"
import LottieView from "lottie-react-native"
import { Platform, StyleSheet, Text, View } from "react-native"
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

const DELAY = 100
const OFFSET = 60
const INITIAL_DELAY = 1000

export default function StartScreen() {
  const { styles, isDark } = useThemeStyles(componentStyles)
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

  return (
    <View style={{ flex: 1 }}>
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
      <View style={styles.pageWrapper}>
        <View style={styles.containerWrapper}>
          {Platform.OS !== "web" && (
            <LottieView
              source={require("@/assets/lottie/onboarding.json")}
              style={{ width: 380, height: 380 }}
              loop={false}
              autoPlay
            />
          )}
          <Animated.Text style={[styles.loginLabel, itemAnimStyles1]}>
            Login to save your data online and make it available on all your
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
                <Text style={styles.loginTextBtn}>Login</Text>
              </AnimatedButton>
            </Animated.View>

            <Animated.View style={itemAnimStyles3}>
              <AnimatedButton
                style={styles.registerBtn}
                scale={0.97}
                onPress={() => router.push("/(modals)/(publicAuth)/sign-up")}
              >
                <Text style={styles.registerTextBtn}>Register</Text>
              </AnimatedButton>
            </Animated.View>
          </View>

          <View style={{ alignItems: "center", gap: 4 }}>
            <Animated.Text style={[styles.orText, itemAnimStyles4]}>
              or
            </Animated.Text>
            <Animated.View style={itemAnimStyles5}>
              <AnimatedButton scale={0.97} style={{ paddingVertical: 6 }}>
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
      maxWidth: 250,
      textAlign: "center",
      lineHeight: 20,
      color: isDark ? Colors.gray[200] : Colors.gray[700],
    },
    loginBtn: {
      backgroundColor: Colors.rose[500],
      borderRadius: 12,
      height: 48,
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    registerBtn: {
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
    loginTextBtn: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
    },
    registerTextBtn: {
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
