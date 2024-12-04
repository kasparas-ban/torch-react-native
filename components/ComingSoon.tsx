import React from "react"
import Colors from "@/constants/Colors"
import { Link } from "expo-router"
import {
  ImageBackground,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native"
import { useAuth } from "@/lib/clerk"

import { AnimatedButton } from "./AnimatedButton"

export function ComingSoon() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const { isSignedIn } = useAuth()

  return (
    <View style={styles.container}>
      <Text
        style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}
      >
        Coming Soon
      </Text>
      <View
        style={[
          styles.separator,
          isDark ? styles.separatorDark : styles.separatorLight,
        ]}
      />
      <Text
        style={[
          styles.paragraph,
          isDark ? styles.paragraphDark : styles.paragraphLight,
        ]}
      >
        {!isSignedIn
          ? "Sign up now and you'll be the first to know when it goes live!"
          : "You'll be the first to know when it goes live!"}
      </Text>
      {!isSignedIn && (
        <Link href="/sign-up" asChild>
          <AnimatedButton style={styles.button}>
            <ImageBackground
              source={require("@/assets/images/gradient_animation.gif")}
              style={styles.buttonBackground}
            >
              <View
                style={{
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "black",
                  position: "absolute",
                  opacity: isDark ? 0.2 : 0,
                }}
              />
              <Text style={styles.buttonText}>Sign Up</Text>
            </ImageBackground>
          </AnimatedButton>
        </Link>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 42,
    fontFamily: "GabaritoBold",
    textTransform: "uppercase",
  },
  titleLight: {
    color: Colors.gray[700],
  },
  titleDark: {
    color: Colors.gray[50],
  },
  paragraph: {
    fontSize: 16,
    maxWidth: 280,
    textAlign: "center",
    marginBottom: 32,
  },
  paragraphLight: {
    color: Colors.gray[600],
  },
  paragraphDark: {
    color: Colors.gray[300],
  },
  separator: {
    marginVertical: 12,
    height: 1,
    width: 200,
    backgroundColor: Colors.gray[400],
  },
  separatorLight: {
    backgroundColor: Colors.gray[400],
  },
  separatorDark: {
    backgroundColor: Colors.gray[400],
  },
  button: {
    borderRadius: 13,
    borderColor: "#ffba95",
    borderWidth: 1,
  },
  buttonBackground: {
    borderRadius: 12,
    overflow: "hidden",
    height: 42,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "900",
    fontSize: 18,
    color: Colors.gray[50],
    userSelect: "none",
  },
})
